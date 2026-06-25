// HaloBeamBullet class: central beam with two side nodes (Halo Beam weapon)
export default class HaloBeamBullet {
  constructor(gameScreen, playerCenterX, playerTop) {
    this.gameScreen = gameScreen;
    this.speed = 5;

    this.centerX = playerCenterX;
    this.centerY = playerTop;

    this.element = document.createElement('div');
    this.element.style.width = '120px';
    this.element.style.height = '42px';
    this.element.style.left = `${this.centerX - 60}px`;
    this.element.style.top = `${this.centerY}px`;
    this.element.style.position = 'absolute';
    this.element.style.pointerEvents = 'none';

    const centerBeam = document.createElement('div');
    centerBeam.style.width = '10px';
    centerBeam.style.height = '42px';
    centerBeam.style.left = '55px';
    centerBeam.style.top = '0';
    centerBeam.style.position = 'absolute';
    centerBeam.style.background = 'linear-gradient(180deg, #ffcf4d 0%, rgba(255, 207, 77, 0.3) 100%)';
    centerBeam.style.boxShadow = '0 0 12px #ffcf4d, inset 0 0 6px rgba(255, 207, 77, 0.5)';
    centerBeam.style.borderRadius = '4px';

    const leftNode = document.createElement('div');
    leftNode.style.width = '8px';
    leftNode.style.height = '8px';
    leftNode.style.left = '14px';
    leftNode.style.top = '17px';
    leftNode.style.position = 'absolute';
    leftNode.style.borderRadius = '50%';
    leftNode.style.border = '1px solid #ff2b7a';
    leftNode.style.background = 'radial-gradient(circle, rgba(255, 43, 122, 0.8), rgba(255, 43, 122, 0.2))';
    leftNode.style.boxShadow = '0 0 10px #ff2b7a';

    const rightNode = document.createElement('div');
    rightNode.style.width = '8px';
    rightNode.style.height = '8px';
    rightNode.style.left = '98px';
    rightNode.style.top = '17px';
    rightNode.style.position = 'absolute';
    rightNode.style.borderRadius = '50%';
    rightNode.style.border = '1px solid #ff2b7a';
    rightNode.style.background = 'radial-gradient(circle, rgba(255, 43, 122, 0.8), rgba(255, 43, 122, 0.2))';
    rightNode.style.boxShadow = '0 0 10px #ff2b7a';

    this.element.appendChild(centerBeam);
    this.element.appendChild(leftNode);
    this.element.appendChild(rightNode);

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.centerY -= this.speed;
    this.element.style.top = `${this.centerY}px`;
  }

  isOffScreen() {
    return this.centerY < -42;
  }

  remove() {
    this.element.remove();
  }

  didCollide(obstacle) {
    const rect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    return (
      rect.left < obstacleRect.right &&
      rect.right > obstacleRect.left &&
      rect.top < obstacleRect.bottom &&
      rect.bottom > obstacleRect.top
    );
  }
}
