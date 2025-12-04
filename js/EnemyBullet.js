// EnemyBullet class: representa una bala disparada por los obstáculos
export default class EnemyBullet {
  // Constructor: crea la bala en la posición del obstáculo
  constructor(obstacleLeft, obstacleTop, obstacleWidth, obstacleHeight) {
    this.width = 5; // Ancho de la bala (px)
    this.height = 15; // Alto de la bala (px)
    // Centra la bala respecto al obstáculo
    this.left = obstacleLeft + obstacleWidth / 2 - this.width / 2;
    this.top = obstacleTop + obstacleHeight; // Aparece justo debajo del obstáculo

    // Crea el elemento visual de la bala
    this.element = document.createElement("div");
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = "#ff0066"; // Mismo color que el obstáculo
    this.element.style.boxShadow = "0 0 10px #ff0066, 0 0 20px #ff0066"; // Brillo rosa

    // Añade la bala al contenedor del juego
    const gameScreen = document.getElementById("game-screen");
    gameScreen.appendChild(this.element);
  }

  // Mueve la bala hacia abajo (llamado en cada frame)
  move() {
    this.top += 4; // Suma 4px a la posición superior (baja rápido)
    this.element.style.top = `${this.top}px`; // Actualiza visualmente
  }

  // Verifica si la bala salió de la pantalla (por abajo)
  isOffScreen() {
    return this.top > 800;
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
