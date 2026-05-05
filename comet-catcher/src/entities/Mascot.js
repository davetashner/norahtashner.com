import Phaser from 'phaser';

const NAVY = 0x0a1f4d;
const TEAL = 0x3ad4c8;
const GREEN = 0x2dbf4e;

export default class Mascot {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.shoulderOffsetX = 30;
    this.shoulderOffsetY = -10;

    this.container = scene.add.container(x, y);

    const cape  = scene.add.triangle(0, 30, -38, 12, 38, 12, 0, 84, GREEN, 0.85);
    const body  = scene.add.rectangle(0, 30, 64, 74, NAVY).setStrokeStyle(2, TEAL);
    const head  = scene.add.circle(0, -32, 42, NAVY).setStrokeStyle(3, TEAL);
    const ring  = scene.add.ellipse(0, -22, 100, 16).setStrokeStyle(2, TEAL);
    const eyeL  = scene.add.circle(-13, -36, 6, 0xffffff);
    const eyeR  = scene.add.circle(13, -36, 6, 0xffffff);
    const pupL  = scene.add.circle(-13, -36, 3, 0x000000);
    const pupR  = scene.add.circle(13, -36, 3, 0x000000);
    const smile = scene.add.arc(0, -22, 11, 0, 180, false).setStrokeStyle(2, 0xffffff);

    this.container.add([cape, body, head, ring, eyeL, eyeR, pupL, pupR, smile]);

    this.armGfx = scene.add.graphics();

    this.armState = {
      L: this.makeArmState('L'),
      R: this.makeArmState('R')
    };
  }

  makeArmState(side) {
    const shoulder = this.shoulderWorld(side);
    return {
      active: false,
      tipX: shoulder.x,
      tipY: shoulder.y,
      cooldownUntil: 0
    };
  }

  setX(x) {
    this.x = x;
    this.container.x = x;
    for (const side of ['L', 'R']) {
      const state = this.armState[side];
      if (!state.active) {
        const sh = this.shoulderWorld(side);
        state.tipX = sh.x;
        state.tipY = sh.y;
      }
    }
  }

  shoulderWorld(side) {
    return {
      x: this.x + (side === 'L' ? -this.shoulderOffsetX : this.shoulderOffsetX),
      y: this.y + this.shoulderOffsetY
    };
  }

  isOnCooldown(side, now) {
    return now < this.armState[side].cooldownUntil;
  }

  reach(side, worldX, worldY, opts = {}) {
    const cooldownMs = opts.cooldownMs ?? 220;
    const reachMs = opts.reachMs ?? 130;
    const retractMs = opts.retractMs ?? 110;
    const state = this.armState[side];
    state.active = true;

    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: state,
        tipX: worldX,
        tipY: worldY,
        duration: reachMs,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          const sh = this.shoulderWorld(side);
          this.scene.tweens.add({
            targets: state,
            tipX: sh.x,
            tipY: sh.y,
            duration: retractMs,
            ease: 'Cubic.easeIn',
            onComplete: () => {
              state.active = false;
              state.cooldownUntil = this.scene.time.now + cooldownMs;
              resolve();
            }
          });
        }
      });
    });
  }

  draw() {
    const g = this.armGfx;
    g.clear();
    for (const side of ['L', 'R']) {
      const state = this.armState[side];
      const sh = this.shoulderWorld(side);
      const dx = state.tipX - sh.x;
      const dy = state.tipY - sh.y;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      g.lineStyle(11, TEAL, 1);
      g.beginPath();
      g.moveTo(sh.x, sh.y);
      g.lineTo(state.tipX, state.tipY);
      g.strokePath();
      g.fillStyle(TEAL, 1);
      g.fillCircle(state.tipX, state.tipY, 10);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(state.tipX - 3, state.tipY - 3, 3);
    }
  }
}
