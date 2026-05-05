# Comet Catcher: Kersey Creek Comets

Mobile-first arcade game starring **K.C. Comet**, the Kersey Creek Elementary mascot. Drag K.C. along the bottom of the screen — his arms telescope upward to grab falling comets. Catch the right ones to hit the level's target score before time runs out.

**Live:** https://norahtashner.com/games/comet-catcher/

## Tech

- Phaser 3 + Vite
- Vanilla JS, no framework
- Static deploy to S3 + CloudFront (the same bucket that hosts norahtashner.com)

## Develop

```bash
npm install
npm run dev
```

Vite binds to your LAN — open the `Network:` URL it prints on your phone to playtest. Lock your phone to portrait.

## Build

```bash
npm run build
```

Output goes to `dist/`. The build is configured with `base: '/games/comet-catcher/'` so all asset URLs resolve correctly at the deployed sub-path.

## Deploy

Push to `main` → GitHub Actions builds and syncs `dist/` to `s3://norahtashner.com/games/comet-catcher/`, then invalidates CloudFront. The site repo's deploy workflow excludes this path so site deploys don't wipe the game.

Required repo secrets (same values as the site repo):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `CLOUDFRONT_DISTRIBUTION_ID`

## Game design

| Color  | Points | Notes                       |
| ------ | -----: | --------------------------- |
| Blue   |     +1 | Common                      |
| Purple |     +3 |                             |
| Yellow |     +5 |                             |
| Red    |     −2 | Subtract back down          |
| Black  |     −5 | Subtract more               |
| Gold   |      ★ | Rare. Instant level pass.   |

Each level is 30 seconds with an **exact** target score. Going over means catching bad comets to subtract back down.

| Level | Name             | Target |
| ----: | ---------------- | -----: |
|     1 | Recess Rally     |     15 |
|     2 | Cafeteria Chaos  |     30 |
|     3 | Comet Storm      |     50 |

## Roadmap

- [x] Step 1: Level 1 prototype — drag mascot, telescoping arms, blue/purple/red comets, score + timer, win/lose
- [ ] Step 2: audio + mute, levels 2 & 3, real K.C. Comet sprite
- [ ] Step 3: leaderboard backend (Lambda + DynamoDB), name moderation
- [ ] Step 4: production launch
