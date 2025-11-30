// Player class
export default class Player {                                    // Exporta la clase para usarla en otros archivos
    constructor(gameScreen) {                                    // Se ejecuta al crear: new Player()
        this.gameScreen = gameScreen;                            // Guarda referencia a la pantalla del juego
        this.width = 20;                                         // Ancho del player (20px)
        this.height = 20;                                        // Alto del player (20px)
        this.left = 240;                                         // Posición centrada (pantalla de 500px)
        this.top = 660;                                          // Posición abajo (pantalla de 700px)
        this.directionX = 0;                                     // Dirección horizontal (0 = parado)
        this.directionY = 0;                                     // Dirección vertical (0 = parado)
        this.element = null;                                     // Guardará el div HTML del player
        
        this.createDOMElement();                                 // Crea el cuadrado verde visible
    }
    
    createDOMElement() {                                         // Crea el elemento visual en pantalla
        // Create player div
        this.element = document.createElement('div');            // Crea un <div> en memoria
        this.element.style.width = `${this.width}px`;            // Aplica ancho: 20px
        this.element.style.height = `${this.height}px`;          // Aplica alto: 20px
        this.element.style.backgroundColor = '#00ff00';          // Color verde neón
        this.element.style.position = 'absolute';                // Permite posicionarlo con left/top
        this.element.style.left = `${this.left}px`;              // Posiciona a 100px desde izquierda
        this.element.style.top = `${this.top}px`;                // Posiciona a 100px desde arriba
        
        this.gameScreen.appendChild(this.element);               // Inserta el div en #game-screen (ahora visible)
    }

    move(){                                                      // Actualiza posición cada frame (60 veces/seg)
        // Update position based on direction
        this.left += this.directionX;                            // Nueva left = posición actual + dirección
        this.top += this.directionY;                             // Nueva top = posición actual + dirección
        
        // Keep player within screen bounds
        if (this.left < 0) this.left = 0;                        // No salir porm la izquierda
        if (this.left > this.gameScreen.offsetWidth - this.width) { // No salir por la derecha
            this.left = this.gameScreen.offsetWidth - this.width;
        }
        if (this.top < 0) this.top = 0;                          // No salir por arriba
        if (this.top > this.gameScreen.offsetHeight - this.height) { // No salir por abajo
            this.top = this.gameScreen.offsetHeight - this.height;
        }
        
        this.updatePosition();                                   // Llama a método separado para actualizar visual
    }
    
    updatePosition() {                                           // Actualiza el visual en pantalla (separado de lógica)
        this.element.style.left = `${this.left}px`;              // Actualiza posición left en CSS
        this.element.style.top = `${this.top}px`;                // Actualiza posición top en CSS
    }
    
    didCollide(obstacle) {                                       // Detecta si player choca con un obstáculo
        // Bounding box collision detection (detección de caja)
        return (
            this.left < obstacle.left + obstacle.width &&        // Lado izquierdo player < lado derecho obstacle
            this.left + this.width > obstacle.left &&            // Lado derecho player > lado izquierdo obstacle
            this.top < obstacle.top + obstacle.height &&         // Lado superior player < lado inferior obstacle
            this.top + this.height > obstacle.top                // Lado inferior player > lado superior obstacle
        );
    }
}