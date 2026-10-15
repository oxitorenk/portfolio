import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const html = readFileSync('dist/index.html', 'utf8');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
assert.equal((html.match(/<article\b/g) || []).length, 7, 'All seven projects must be rendered');
assert.equal((html.match(/class="video-trigger"/g) || []).length, 7, 'Every gameplay video must have a trigger');
assert.equal((html.match(/class="fullscreen-trigger"/g) || []).length, 7, 'Every video must offer fullscreen');
assert.equal((html.match(/<video\b[^>]*\bcontrols(?:\s|=|>)/g) || []).length, 7, 'All videos must work with native controls when JavaScript is unavailable');
assert(!html.includes('volume-control'), 'Inline videos must not show a custom volume slider');
assert(!html.includes('Link coming soon'), 'Missing store links must be omitted');
assert(!html.includes('<dialog'), 'Video must play in the card without a dialog');
assert.equal((html.match(/<video\b/g) || []).length, 7, 'Each card must have an inline player');
assert.equal((html.match(/preload="auto"/g) || []).length, 7, 'Every video must request preloading');
assert.equal((html.match(/<video\b[^>]*\bposter="/g) || []).length, 7, 'Each video must have a gameplay poster before playback');
assert(!html.includes('↗'), 'Navigation arrows must not render as platform emoji');
assert(!html.includes('placeholder artwork'), 'Video cards must not show placeholder artwork');
assert.equal((html.match(/class="contribution"/g) || []).length, 7, 'All projects must show supplied contributions');
assert(html.replace(/<[^>]+>/g, '').includes('Game Developer &amp; Game Designer'), 'Battle Gears must show both roles');
assert.equal((html.match(/class="project-heading featured-heading"/g) || []).length, 3, 'Featured cards must identify games above the video');
assert(html.includes('id="contact-title"'), 'Portfolio must offer contact at the end');
assert(!html.includes('Metrics coming soon'), 'All featured releases have supplied metrics');
assert(html.includes('50M+'), 'Frontline Heroes must display the supplied download count');
assert(html.includes('100M+'), 'Agent Hunt must display the supplied download count');
assert(!/href="(?:#|https?:\/\/example\.)"/.test(html), 'No dummy destinations');
for (const match of html.matchAll(/(?:src|href|data-video|poster)="([^"]+)"/g)) {
  const path = match[1];
  if (path.startsWith('#') || /^(https?:|mailto:)/.test(path)) continue;
  assert(path.startsWith(`${base}/`), `Asset must respect the deployment base: ${path}`);
  assert(existsSync(join('dist', path.slice(base.length))), `Missing asset: ${path}`);
}
console.log('Static output checks passed: seven projects, valid assets, no fake destinations.');

const seaLords = html.match(/<article\b[^>]*>[\s\S]*?<h3>Sea Lords<\/h3>[\s\S]*?<\/article>/)?.[0]?.split('<article').at(-1);
assert(seaLords?.includes('5M+'));
assert(seaLords.includes('id1643423530'));
assert(!seaLords.includes('play.google.com'), 'Sea Lords has no Android release');
