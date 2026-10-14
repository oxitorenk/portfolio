import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the shipped player script with deterministic media failures and events.
class Element {
  hidden = true;
  attributes = {};
  listeners = {};
  textContent = '';
  classList = { toggle() {} };
  addEventListener(name, callback) { (this.listeners[name] ??= []).push(callback); }
  setAttribute(name, value) { this.attributes[name] = value; }
  focus(options) { document.activeElement = this; this.focusOptions = options; this.focusCalls = (this.focusCalls ?? 0) + 1; }
  emit(name) { return Promise.all((this.listeners[name] ?? []).map(callback => callback())); }
}
class Video extends Element {
  paused = true;
  error = null;
  readyState = 4;
  controls = true;
  mode = 'success';
  play() {
    if (this.mode === 'reject') return Promise.reject(new DOMException('Denied', 'NotAllowedError'));
    this.paused = false;
    this.emit('play');
    if (this.mode === 'pending') return new Promise((_resolve, reject) => { this.cancel = reject; });
    this.emit('playing');
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.cancel?.(new DOMException('Interrupted', 'AbortError'));
    this.cancel = null;
    this.emit('pause');
  }
  load() { this.error = null; this.emit('loadstart'); }
  requestFullscreen() { return Promise.reject(new DOMException('Denied', 'NotAllowedError')); }
}
function player(title) {
  const video = new Video(), button = new Element(), error = new Element(), status = new Element(), fullscreen = new Element();
  const media = new Element();
  button.dataset = { title };
  button.closest = () => media;
  media.querySelector = selector => ({ video, '.video-error': error, '.video-status': status, '.fullscreen-trigger': fullscreen })[selector];
  return { video, button, error, status, fullscreen };
}
const a = player('Agent Hunt'), b = player('Battle Gears');
const document = new Element();
document.fullscreenEnabled = true;
document.querySelectorAll = selector => selector === '.video-trigger' ? [a.button, b.button] : [a.video, b.video];
const source = readFileSync('src/components/ProjectCard.astro', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, { document, DOMException });
assert.equal(a.video.volume, 0.5);
assert.equal(a.video.controls, false);
assert.equal(a.button.hidden, false);

a.video.mode = 'reject';
await a.button.emit('click');
assert.equal(a.error.hidden, false, 'A rejected play without video.error must explain recovery');
assert.match(a.button.attributes['aria-label'], /^Retry/);
assert.equal(a.status.hidden, true);
a.video.mode = 'success';
await a.button.emit('click');
assert.equal(a.error.hidden, true, 'Retry clears the error');
assert.equal(a.video.paused, false);
await a.video.emit('waiting');
assert.equal(a.status.hidden, false, 'Buffering must be visible');
assert.equal(a.button.attributes['aria-busy'], 'true');
await a.video.emit('playing');
assert.equal(a.status.hidden, true);
await b.button.emit('click');
assert.equal(a.video.paused, true, 'Starting another video pauses the previous player');
assert.equal(b.video.paused, false);
b.video.pause();
b.video.mode = 'pending';
const pending = b.button.emit('click');
assert.equal(b.status.hidden, false);
await b.button.emit('click');
await pending;
assert.equal(b.error.hidden, true, 'Cancelling an in-flight play must not show an error');
assert.equal(b.status.hidden, true);
b.video.mode = 'pending';
const stale = b.button.emit('click');
const cancel = b.button.emit('click');
b.video.mode = 'reject';
const latest = b.button.emit('click');
await Promise.all([stale, cancel, latest]);
assert.equal(b.error.hidden, false, 'An old cancelled request must not overwrite a newer failure');
assert.match(b.button.attributes['aria-label'], /^Retry/);
b.video.error = { code: 2 };
await b.video.emit('error');
assert.equal(b.error.hidden, false);
b.video.mode = 'success';
await b.button.emit('click');
assert.equal(b.video.error, null, 'Retry reloads failed media');
assert.equal(b.error.hidden, true);
b.video.error = { code: 2 };
await b.video.emit('error');
assert.equal(b.video.paused, true, 'A connection failure during playback must stop the player');
assert.match(b.button.attributes['aria-label'], /^Retry/, 'An interrupted video must offer retry, not pause');
assert.equal(b.status.hidden, true);
await b.fullscreen.emit('click');
assert.equal(b.video.controls, false, 'Denied fullscreen restores inline controls');
assert.match(b.error.textContent, /Fullscreen/);
document.fullscreenElement = a.video;
await document.emit('fullscreenchange');
assert.equal(a.video.controls, true);
document.fullscreenElement = b.video;
await document.emit('fullscreenchange');
assert.equal(a.fullscreen.focusCalls, undefined, 'Switching to another fullscreen video must not steal focus');
document.fullscreenElement = null;
await document.emit('fullscreenchange');
assert.equal(document.activeElement, b.fullscreen, 'Fullscreen exit restores focus to its own button');
assert.equal(b.video.controls, false);
assert.equal(b.fullscreen.focusOptions.preventScroll, true);
await document.emit('fullscreenchange');
assert.equal(b.fullscreen.focusCalls, 1, 'Unrelated fullscreen events must not move focus');
await a.video.emit('webkitbeginfullscreen');
await a.video.emit('webkitendfullscreen');
assert.equal(document.activeElement, a.fullscreen, 'Safari fullscreen exit restores focus');
assert.equal(a.video.controls, false);
console.log('Player checks passed: playback recovery and standard/Safari fullscreen focus return.');
