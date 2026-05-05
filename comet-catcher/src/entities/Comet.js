import { COMET_TYPES } from '../config/levels.js';

export default class Comet {
  constructor(scene, x, type) {
    this.scene = scene;
    this.type = type;
    this.def = COMET_TYPES[type];
    this.alive = true;
    this.vy = 0;

    const r = this.def.radius;
    this.gfx = scene.add.container(x, -40);

    const trail = scene.add.ellipse(0, -r, r * 0.85, r * 1.7, this.def.color, 0.35);
    const ball  = scene.add.circle(0, 0, r, this.def.color).setStrokeStyle(2, 0xffffff, 0.7);

    if (type === 'gold') {
      const star = scene.add.text(0, 0, '★', {
        fontFamily: 'sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#ffffff'
      }).setOrigin(0.5);
      this.gfx.add([trail, ball, star]);
      this.glowTween = scene.tweens.add({
        targets: ball,
        scale: 1.15,
        yoyo: true,
        repeat: -1,
        duration: 280,
        ease: 'Sine.easeInOut'
      });
    } else {
      const label = scene.add.text(0, 0, this.def.points >= 0 ? `+${this.def.points}` : `${this.def.points}`, {
        fontFamily: 'sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#ffffff'
      }).setOrigin(0.5);
      this.gfx.add([trail, ball, label]);
    }
  }

  get x() { return this.gfx.x; }
  get y() { return this.gfx.y; }
  set y(v) { this.gfx.y = v; }

  destroy() {
    this.alive = false;
    if (this.glowTween) this.glowTween.stop();
    this.gfx.destroy();
  }
}
