const PICKUP_CONFIG = {
  health: {
    color: '#4dffb8',
    glow: '0 0 12px rgba(77, 255, 184, 0.85)',
    label: 'H'
  },
  shield: {
    color: '#4dfcff',
    glow: '0 0 14px rgba(77, 252, 255, 0.95), 0 0 24px rgba(77, 252, 255, 0.75)',
    label: ''
  }
};

export default class Pickup {
  constructor(gameScreen, type, left, top) {
    this.gameScreen = gameScreen;
    this.type = type;
    this.width = 18;
    this.height = 18;
    this.left = Math.max(0, left - this.width / 2);
    this.top = top;

    const config = PICKUP_CONFIG[type];

    if (type === 'shield') {
      this.width = 12;
      this.height = 12;
      this.left = Math.max(0, left - this.width / 2);
    }

    this.element = document.createElement('div');
    this.element.textContent = config.label;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = 'absolute';
    this.element.style.display = 'flex';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'center';
    this.element.style.borderRadius = '50%';
    this.element.style.border = type === 'shield' ? 'none' : `1px solid ${config.color}`;
    this.element.style.backgroundColor = type === 'shield' ? config.color : 'rgba(7, 14, 28, 0.85)';
    this.element.style.color = config.color;
    this.element.style.fontSize = '11px';
    this.element.style.fontWeight = '700';
    this.element.style.boxShadow = config.glow;
    if (type === 'shield') {
      this.element.style.fontSize = '0';
    }
    this.element.style.pointerEvents = 'none';

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.top += 2;
    this.element.style.top = `${this.top}px`;
  }

  isOffScreen() {
    return this.top > this.gameScreen.offsetHeight + this.height;
  }

  didCollide(player) {
    return (
      this.left < player.left + player.width &&
      this.left + this.width > player.left &&
      this.top < player.top + player.height &&
      this.top + this.height > player.top
    );
  }

  remove() {
    this.element.remove();
  }
}