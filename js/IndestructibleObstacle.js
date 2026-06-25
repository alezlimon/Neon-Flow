export default class IndestructibleObstacle {
  constructor() {
    this.gameScreen = document.getElementById("game-screen");
    this.width = 70;
    this.height = 20;
    this.left = Math.floor(Math.random() * Math.max(1, this.gameScreen.offsetWidth - this.width));
    this.top = -this.height;

    this.element = document.createElement("div");
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = "#808080"; // Gris mate

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.top += 3;
    this.element.style.top = `${this.top}px`;
  }

  // Método para verificar si el obstáculo salió de la pantalla
  isOffScreen() {
    return this.top > this.gameScreen.offsetHeight;
  }

  // Método para eliminar el obstáculo del DOM
  remove() {
    this.element.remove();
  }
}
