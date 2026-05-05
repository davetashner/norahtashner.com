import Phaser from 'phaser';

export default class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  init(data) { this.result = data; }

  create() {
    const { width: W, height: H } = this.scale.gameSize;
    const { level, score, target, won } = this.result;

    this.add.rectangle(0, 0, W, H, 0x07173a, 0.96).setOrigin(0);

    this.add.text(W / 2, H * 0.28, won ? 'CAUGHT THEM ALL!' : 'TRY AGAIN!', {
      fontFamily: 'sans-serif', fontSize: '40px', fontStyle: 'bold',
      color: won ? '#3ad4c8' : '#ffd84e'
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.4, `Score: ${score}`, {
      fontFamily: 'sans-serif', fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.46, `Target: ${target}`, {
      fontFamily: 'sans-serif', fontSize: '20px', color: '#9fb6e0'
    }).setOrigin(0.5);

    if (!won) {
      const diff = score - target;
      const hint = diff > 0
        ? `${diff} too many — catch some red or black comets to subtract`
        : `${-diff} short — keep chasing blue and purple`;
      this.add.text(W / 2, H * 0.54, hint, {
        fontFamily: 'sans-serif', fontSize: '15px', color: '#9fb6e0',
        wordWrap: { width: W - 80 }, align: 'center'
      }).setOrigin(0.5);
    }

    const btn = this.add.text(W / 2, H * 0.7, '▶  PLAY AGAIN', {
      fontFamily: 'sans-serif', fontSize: '28px', fontStyle: 'bold',
      color: '#0a1f4d', backgroundColor: '#3ad4c8',
      padding: { x: 26, y: 16 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.start('GameScene', { level }));
  }
}
