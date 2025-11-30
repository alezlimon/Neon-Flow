export default class IndestructibleObstacle {
  constructor() {
    this.width = 70;
    this.height = 20;
    this.left = Math.floor(Math.random() * (500 - this.width));
    this.top = -this.height;

    this.element = document.createElement("div");
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = "#808080"; // Gris mate

    const gameScreen = document.getElementById("game-screen");
    gameScreen.appendChild(this.element);
  }

  move() {
    this.top += 3;
    this.element.style.top = `${this.top}px`;
  }

  // Método para verificar si el obstáculo salió de la pantalla
  isOffScreen() {
    return this.top > 800;
  }

  // Método para eliminar el obstáculo del DOM
  remove() {
    this.element.remove();
  }
}
