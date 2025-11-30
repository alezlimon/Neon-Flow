// Bullet class: represents a projectile fired by the player
// Cada instancia es una bala que aparece en pantalla y se mueve hacia arriba
class Bullet {
  // Constructor: crea una bala en la posición del jugador
  constructor(gameScreen, playerLeft, playerTop, playerWidth) {
    this.gameScreen = gameScreen; // Referencia al contenedor del juego
    this.width = 5;               // Ancho de la bala (px)
    this.height = 15;             // Alto de la bala (px)
    // Centra la bala respecto al jugador
    this.left = playerLeft + playerWidth / 2 - this.width / 2;
    this.top = playerTop;         // Aparece justo encima del jugador

    // Crea el elemento visual de la bala
    this.element = document.createElement("div");
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = "#00ffff"; // Color cyan neón
    this.element.style.boxShadow = "0 0 10px #00ffff, 0 0 20px #00ffff"; // Brillo
    this.gameScreen.appendChild(this.element); // Añade la bala al juego
  }

  // Mueve la bala hacia arriba (llamado en cada frame)
  move() {
    this.top -= 2; // Resta 2px a la posición superior (sube)
    this.element.style.top = `${this.top}px`; // Actualiza visualmente
  }

  // Verifica si la bala salió de la pantalla (por arriba)
  isOffScreen() {
    return this.top < -this.height;
  }

  // Elimina la bala del DOM (cuando colisiona o sale de pantalla)
  remove() {
    this.element.remove();
  }

  // Detecta colisión con un obstáculo usando bounding box (AABB)
  didCollide(obstacle) {
    const bulletRect = this.element.getBoundingClientRect(); // Rectángulo de la bala
    const obstacleRect = obstacle.element.getBoundingClientRect(); // Rectángulo del obstáculo

    // Algoritmo AABB: verifica si los rectángulos se solapan
    if (
      bulletRect.left < obstacleRect.right &&
      bulletRect.right > obstacleRect.left &&
      bulletRect.top < obstacleRect.bottom &&
      bulletRect.bottom > obstacleRect.top
    ) {
      return true; // Hay colisión
    }
    return false; // No hay colisión
  }
}

export default Bullet;
