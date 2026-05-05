export const COMET_TYPES = {
  blue:   { color: 0x4ea8ff, points: 1,  radius: 22 },
  purple: { color: 0xa97dff, points: 3,  radius: 22 },
  yellow: { color: 0xffd84e, points: 5,  radius: 20 },
  red:    { color: 0xff5a5a, points: -2, radius: 22 },
  black:  { color: 0x222831, points: -5, radius: 22 },
  gold:   { color: 0xf2c14e, points: 0,  radius: 16, instantPass: true }
};

export const LEVELS = {
  1: {
    name: 'Recess Rally',
    durationMs: 30_000,
    targetScore: 15,
    spawnIntervalMs: [800, 1300],
    fallSpeed: [220, 320],
    weights: { blue: 55, purple: 25, red: 20 }
  },
  2: {
    name: 'Cafeteria Chaos',
    durationMs: 30_000,
    targetScore: 30,
    spawnIntervalMs: [600, 1100],
    fallSpeed: [260, 380],
    weights: { blue: 30, purple: 25, yellow: 15, red: 18, black: 10, gold: 2 }
  },
  3: {
    name: 'Comet Storm',
    durationMs: 30_000,
    targetScore: 50,
    spawnIntervalMs: [400, 800],
    fallSpeed: [320, 460],
    weights: { blue: 25, purple: 20, yellow: 15, red: 18, black: 18, gold: 4 }
  }
};
