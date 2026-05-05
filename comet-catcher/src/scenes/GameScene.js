import Phaser from 'phaser';
import Mascot from '../entities/Mascot.js';
import Comet from '../entities/Comet.js';
import { LEVELS } from '../config/levels.js';

const MAX_ARM_REACH_RATIO = 0.6; // 60% of screen height

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.levelNum = data.level || 1;
    this.config = LEVELS[this.levelNum];
  }

  create() {
    const { width, height } = this.scale.gameSize;
    this.W = width;
    this.H = height;

    this.drawBackground();

    this.add.rectangle(this.W / 2, this.H - 80, this.W, 4, 0x3ad4c8, 0.6);

    this.mascot = new Mascot(this, this.W / 2, this.H - 130);
    this.maxArmReach = this.H * MAX_ARM_REACH_RATIO;

    this.input.on('pointerdown', this.onPointer, this);
    this.input.on('pointermove', this.onPointer, this);

    this.score = 0;
    this.timeLeft = this.config.durationMs;
    this.comets = [];
    this.gameOver = false;

    this.scoreText = this.add.text(20, 60, '', {
      fontFamily: 'sans-serif', fontSize: '28px', fontStyle: 'bold', color: '#ffffff'
    });
    this.targetText = this.add.text(20, 94, `Target: ${this.config.targetScore}`, {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#3ad4c8'
    });
    this.timeText = this.add.text(this.W - 20, 60, '', {
      fontFamily: 'sans-serif', fontSize: '28px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(1, 0);
    this.add.text(this.W / 2, 30, `Level ${this.levelNum} — ${this.config.name}`, {
      fontFamily: 'sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5, 0.5);

    this.updateHUD();
    this.scheduleNextSpawn();
  }

  drawBackground() {
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x07173a, 0x07173a, 0x1c3a8a, 0x1c3a8a, 1);
    sky.fillRect(0, 0, this.W, this.H);
    for (let i = 0; i < 50; i++) {
      const sx = Math.random() * this.W;
      const sy = Math.random() * this.H * 0.75;
      this.add.circle(sx, sy, Math.random() * 1.4 + 0.4, 0xffffff, 0.7);
    }
  }

  scheduleNextSpawn() {
    const [min, max] = this.config.spawnIntervalMs;
    const delay = Phaser.Math.Between(min, max);
    this.time.delayedCall(delay, () => {
      if (this.gameOver) return;
      this.spawnComet();
      this.scheduleNextSpawn();
    });
  }

  spawnComet() {
    const type = this.weightedPick(this.config.weights);
    const margin = 50;
    const x = Phaser.Math.Between(margin, this.W - margin);
    const comet = new Comet(this, x, type);
    const [vmin, vmax] = this.config.fallSpeed;
    comet.vy = Phaser.Math.Between(vmin, vmax);
    this.comets.push(comet);
  }

  weightedPick(weights) {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (const [k, w] of Object.entries(weights)) {
      r -= w;
      if (r <= 0) return k;
    }
    return Object.keys(weights)[0];
  }

  onPointer(pointer) {
    if (this.gameOver) return;
    if (!pointer.isDown) return;
    const margin = 64;
    const x = Phaser.Math.Clamp(pointer.x, margin, this.W - margin);
    this.mascot.setX(x);
  }

  update(_time, delta) {
    if (this.gameOver) return;

    this.timeLeft -= delta;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endLevel();
    }

    for (const c of this.comets) {
      if (!c.alive) continue;
      c.y += c.vy * (delta / 1000);
      if (c.y > this.H + 40) c.destroy();
    }
    this.comets = this.comets.filter(c => c.alive);

    this.attemptCatches();

    this.mascot.draw();
    this.updateHUD();
  }

  attemptCatches() {
    const now = this.time.now;
    for (const c of this.comets) {
      if (!c.alive) continue;
      if (c.y < this.maxArmReach) continue;
      if (c.y > this.mascot.y - 16) continue;

      const side = c.x < this.mascot.x ? 'L' : 'R';
      const state = this.mascot.armState[side];
      if (state.active) continue;
      if (this.mascot.isOnCooldown(side, now)) continue;

      const sh = this.mascot.shoulderWorld(side);
      const dx = c.x - sh.x;
      const dy = sh.y - c.y;
      const reach = Math.hypot(dx, dy);
      if (reach > this.maxArmReach) continue;

      // Catch!
      const caught = c;
      caught.alive = false;
      this.mascot.reach(side, c.x, c.y);
      this.applyComet(caught);
      this.tweens.add({
        targets: caught.gfx,
        scale: 1.4,
        alpha: 0,
        duration: 180,
        ease: 'Cubic.easeOut',
        onComplete: () => caught.gfx.destroy()
      });
    }
  }

  applyComet(comet) {
    const def = comet.def;
    if (def.instantPass) {
      this.flash(this.mascot.x, this.mascot.y - 110, 'GOLDEN!', '#f2c14e');
      this.score = this.config.targetScore;
      this.endLevel();
      return;
    }
    this.score += def.points;
    const text = def.points >= 0 ? `+${def.points}` : `${def.points}`;
    const color = def.points >= 0 ? '#3ad4c8' : '#ff5a5a';
    this.flash(comet.x, comet.y, text, color);
  }

  flash(x, y, text, color) {
    const t = this.add.text(x, y, text, {
      fontFamily: 'sans-serif', fontSize: '26px', fontStyle: 'bold', color
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t,
      y: y - 60,
      alpha: 0,
      duration: 600,
      ease: 'Cubic.easeOut',
      onComplete: () => t.destroy()
    });
  }

  updateHUD() {
    this.scoreText.setText(`Score: ${this.score}`);
    this.timeText.setText(`${Math.ceil(this.timeLeft / 1000)}s`);
  }

  endLevel() {
    if (this.gameOver) return;
    this.gameOver = true;
    const won = this.score === this.config.targetScore;
    this.time.delayedCall(450, () => {
      this.scene.start('ResultScene', {
        level: this.levelNum,
        score: this.score,
        target: this.config.targetScore,
        won
      });
    });
  }
}
