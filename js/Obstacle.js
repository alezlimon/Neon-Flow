// Obstacle class
export default class Obstacle {
  // Exporta la clase para usarla en otros archivos
  constructor(gameScreen) {
    // Se ejecuta al crear: new Obstacle()
    this.gameScreen = gameScreen; // Guarda referencia a la pantalla del juego
    this.width = 40; // Ancho del obstáculo (40px)
    this.height = 40; // Alto del obstáculo (40px)

    // Random X position within game screen
    const maxX = gameScreen.offsetWidth - this.width; // Máximo X para no salir del borde
    this.left = Math.random() * maxX; // Posición X aleatoria (usando 'left' como profe)

    this.top = -this.height; // Empieza arriba (invisible, usando 'top' como profe)
    this.element = null; // Guardará el div HTML del obstáculo

    this.createDOMElement(); // Crea el cuadrado rojo visible
  }

  createDOMElement() {
    // Crea el elemento visual en pantalla
    // Create obstacle div
    this.element = document.createElement("div"); // Crea un <div> en memoria
    this.element.style.width = `${this.width}px`; // Aplica ancho: 40px
    this.element.style.height = `${this.height}px`; // Aplica alto: 40px
    this.element.style.backgroundColor = "#ff0066"; // Color rosa/rojo neón
    this.element.style.position = "absolute"; // Permite posicionarlo con left/top
    this.element.style.left = `${this.left}px`; // Posiciona en X aleatoria
    this.element.style.top = `${this.top}px`; // Posiciona arriba (fuera de vista)

    this.gameScreen.appendChild(this.element); // Inserta el div en #game-screen
  }

  move() {
    // Actualiza posición cada frame (cae hacia abajo)
    // Update position (fall down)
    this.top += 3; // Nueva top = posición actual + 3px (cae)

    this.updatePosition(); // Llama a método separado para actualizar visual
  }

  updatePosition() {
    // Actualiza el visual en pantalla (separado de lógica)
    this.element.style.left = `${this.left}px`; // Actualiza posición left en CSS
    this.element.style.top = `${this.top}px`; // Actualiza posición top en CSS
  }

  isOffScreen() {
    // Verifica si salió por abajo
    return this.top > this.gameScreen.offsetHeight; // true si top > altura de la pantalla
  }

  remove() {
    // Elimina el obstáculo
    this.element.remove(); // Quita el div del DOM (desaparece)
  }
}
