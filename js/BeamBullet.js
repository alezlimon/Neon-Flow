// BeamBullet class: projectile that is a continuous beam (Core Beam weapon)
export default class BeamBullet {
  constructor(gameScreen, playerCenterX, playerTop) {
    this.gameScreen = gameScreen;
    this.width = 5;
    this.height = 300;
    this.playerCenterX = playerCenterX;
    this.left = playerCenterX - this.width / 2;
    this.top = playerTop - this.height;
    this.speed = 0;

    this.element = document.createElement('div');
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = 'absolute';
    this.element.style.background = 'linear-gradient(180deg, #4dfcff 0%, #4dfcff 50%, rgba(77, 252, 255, 0.3) 100%)';
    this.element.style.boxShadow = '0 0 8px #4dfcff, inset 0 0 4px rgba(77, 252, 255, 0.8)';
    this.element.style.borderRadius = '2px';
    this.element.style.border = '0.5px solid #4dfcff';

    this.gameScreen.appendChild(this.element);
  }

  updatePosition(playerCenterX, playerTop) {
    this.left = playerCenterX - this.width / 2;
    this.top = playerTop - this.height;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  move() {
    // Beam is stationary, anchored to player position
  }

  isOffScreen() {
    // Beam never goes off-screen (it's always active while firing)
    return false;
  }

  remove() {
    this.element.remove();
  }

  didCollide(obstacle) {
    const beamRect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    return (
      beamRect.left < obstacleRect.right &&
      beamRect.right > obstacleRect.left &&
      beamRect.top < obstacleRect.bottom &&
      beamRect.bottom > obstacleRect.top
    );
  }
}
