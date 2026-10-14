export interface Project {
  slug: string;
  title: string;
  role: string;
  contribution: string;
  featured: boolean;
  downloads?: string;
  icon: string;
  video: string;
  appStore?: string;
  googlePlay?: string;
}
export const profile = {
  name: 'Oğuzhan Akbulut',
  role: 'Game Developer',
  description: 'I design and develop games, taking projects from early concepts through prototyping, production, and launch.',
  github: 'https://github.com/oxitorenk',
  linkedin: 'https://www.linkedin.com/in/akbulutoguzhan/',
  email: 'akbulutoguzhan@outlook.com.tr',
};
export const projects: Project[] = [
  {
    slug: 'agent-hunt', title: 'Agent Hunt', role: 'Game Developer',
    contribution: 'Joined after the initial prototype, developing gameplay and meta systems across iterations, integrating SDKs, fixing bugs, and polishing the experience.',
    featured: true,
    icon: 'images/agent-hunt-icon.webp', video: 'video/agent_hunt_gameplay.mp4',
    downloads: '100M+',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.gnarlygamestudio.agenthunt&hl=en',
    appStore: 'https://apps.apple.com/tr/app/agent-hunt-hitman-shooter/id6450975034',
  },
  {
    slug: 'frontline-heroes', title: 'Frontline Heroes', role: 'Game Developer',
    contribution: 'Built the initial prototype and developed gameplay and meta systems through subsequent iterations, including SDK integration, bug fixing, and polish.',
    featured: true,
    icon: 'images/frontline-heroes-icon.webp', video: 'video/frontline_gameplay.mp4',
    downloads: '50M+',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.GnarlyGameStudio.FrontlineHeroes',
    appStore: 'https://apps.apple.com/tr/app/frontline-heroes-army-games/id6478924604',
  },
  {
    slug: 'battle-gears', title: 'Battle Gears', role: 'Game Developer & Game Designer',
    contribution: 'Built the initial prototype. Worked on system design and balancing in later iterations.',
    featured: false,
    icon: 'images/battle-gears-icon.webp', video: 'video/battle_gears_gameplay.mp4',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.gnarlygamestudio.gearfight',
    appStore: 'https://apps.apple.com/tr/app/battle-gears/id6745822241',
  },
  {
    slug: 'cartel-warfare', title: 'Cartel Warfare', role: 'Game Developer & Game Designer',
    contribution: 'Contributed to gameplay and meta development in early iterations. Took full responsibility for game design in later iterations.',
    featured: false,
    icon: 'images/cartel-warfare-icon.webp', video: 'video/cartel_gameplay.mp4',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.gnarlygamestudio.modernshooter',
    appStore: 'https://apps.apple.com/tr/app/cartel-warfare/id6578442129',
  },
  {
    slug: 'apex-mutant', title: 'Apex Mutant', role: 'Game Developer',
    contribution: 'Built the initial prototype and handled all development, including gameplay systems, animation, and polish.',
    featured: false,
    icon: 'images/apex-mutant-icon.webp', video: 'video/apex-mutant-gameplay.mp4',
    appStore: 'https://apps.apple.com/tr/app/apex-mutant/id6758298129',
  },
  {
    slug: 'zombie-sniper', title: 'Zombie Sniper', role: 'Game Designer',
    contribution: 'Designed the game and worked on technical art, game feel, and polish.',
    featured: false,
    icon: 'images/zombie-sniper-icon.webp', video: 'video/zombie_sniper_gameplay.mp4',
    appStore: 'https://apps.apple.com/tr/app/zombie-sniper-last-defense/id6761610776',
  },
];
