// EnemyBullet class: representa una bala disparada por los obstáculos
export default class EnemyBullet {
  // Constructor: crea la bala en la posición del obstáculo
  constructor(obstacleLeft, obstacleTop, obstacleWidth, obstacleHeight, options = {}) {
    this.gameScreen = document.getElementById("game-screen");
    this.width = options.width || 5; // Ancho de la bala (px)
    this.height = options.height || 15; // Alto de la bala (px)
    // Centra la bala respecto al obstáculo
    const startOffsetX = options.startOffsetX || 0;
    this.left = obstacleLeft + obstacleWidth / 2 - this.width / 2 + startOffsetX;
    this.top = obstacleTop + obstacleHeight + (options.startOffsetY || 0); // Aparece justo debajo del obstáculo
    this.velocityX = options.velocityX || 0;
    this.velocityY = options.velocityY || 4;
    this.color = options.color || "#ff0066";

    // Crea el elemento visual de la bala
    this.element = document.createElement("div");
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = this.color;
    this.element.style.boxShadow = `0 0 10px ${this.color}, 0 0 20px ${this.color}`;

    // Añade la bala al contenedor del juego
    this.gameScreen.appendChild(this.element);
  }

  // Mueve la bala hacia abajo (llamado en cada frame)
  move() {
    this.top += this.velocityY;
    this.left += this.velocityX;
    this.element.style.top = `${this.top}px`; // Actualiza visualmente
    this.element.style.left = `${this.left}px`;
  }

  // Verifica si la bala salió de la pantalla (por abajo)
  isOffScreen() {
    return this.top > this.gameScreen.offsetHeight + this.height;
  }

  // Elimina la bala del DOM (cuando colisiona o sale de pantalla)
  remove() {
    this.element.remove();
  }

  // Detecta colisión con el jugador usando bounding box (AABB)
  didCollide(player) {
    const bulletRect = this.element.getBoundingClientRect(); // Rectángulo de la bala
    const playerRect = player.element.getBoundingClientRect(); // Rectángulo del jugador

    // Algoritmo AABB: verifica si los rectángulos se solapan
    if (
      bulletRect.left < playerRect.right &&
      bulletRect.right > playerRect.left &&
      bulletRect.top < playerRect.bottom &&
      bulletRect.bottom > playerRect.top
    ) {
      return true; // Hay colisión
    } else {
      return false; // No hay colisión
    }
  }
}
