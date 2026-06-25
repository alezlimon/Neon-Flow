export default class EliteObstacle {
  constructor(gameScreen, sectorLevel = 1) {
    this.gameScreen = gameScreen;
    this.width = 58;
    this.height = 58;
    this.left = Math.max(0, Math.random() * (gameScreen.offsetWidth - this.width));
    this.top = -this.height;
    this.speed = 1.2 + Math.min(sectorLevel * 0.15, 1.3);
    this.maxHp = 10 + sectorLevel * 3;
    this.hp = this.maxHp;
    this.phase = Math.random() * Math.PI * 2;
    this.telegraphTimeout = null;

    this.element = document.createElement('div');
    this.element.className = 'elite-obstacle';
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.hpBar = document.createElement('div');
    this.hpBar.className = 'elite-hp-bar';
    this.hpFill = document.createElement('div');
    this.hpFill.className = 'elite-hp-fill';
    this.hpBar.appendChild(this.hpFill);
    this.element.appendChild(this.hpBar);

    this.gameScreen.appendChild(this.element);
    this.updateHpBar();
  }

  move() {
    this.top += this.speed;
    this.left += Math.sin((this.top / 18) + this.phase) * 0.9;

    const maxX = this.gameScreen.offsetWidth - this.width;
    if (this.left < 0) this.left = 0;
    if (this.left > maxX) this.left = maxX;

    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  takeHit(amount = 1) {
    this.hp = Math.max(0, this.hp - amount);
    this.updateHpBar();

    if (this.getHealthRatio() <= 0.5) {
      this.element.classList.add('elite-enraged');
    }

    this.element.classList.add('elite-hit');
    setTimeout(() => this.element.classList.remove('elite-hit'), 90);
    return this.hp <= 0;
  }

  getHealthRatio() {
    return this.maxHp > 0 ? this.hp / this.maxHp : 0;
  }

  getAttackProfile() {
    if (this.getHealthRatio() > 0.5) {
      return {
        spread: [-1.35, 0, 1.35],
        speed: 4.7,
        color: '#ff5a9e',
        width: 4,
        height: 12,
        telegraphMs: 210
      };
    }

    return {
      spread: [-2.2, -0.9, 0.9, 2.2],
      speed: 5.6,
      color: '#ff86b8',
      width: 4,
      height: 12,
      telegraphMs: 260
    };
  }

  startTelegraph(durationMs = 220) {
    this.element.classList.add('elite-telegraph');
    if (this.telegraphTimeout) {
      clearTimeout(this.telegraphTimeout);
    }
    this.telegraphTimeout = setTimeout(() => {
      this.element.classList.remove('elite-telegraph');
      this.telegraphTimeout = null;
    }, durationMs);
  }

  updateHpBar() {
    const ratio = this.maxHp > 0 ? this.hp / this.maxHp : 0;
    this.hpFill.style.width = `${Math.max(0, ratio * 100)}%`;
  }

  isOffScreen() {
    return this.top > this.gameScreen.offsetHeight + this.height;
  }

  remove() {
    if (this.telegraphTimeout) {
      clearTimeout(this.telegraphTimeout);
      this.telegraphTimeout = null;
    }
    this.element.remove();
  }
}
