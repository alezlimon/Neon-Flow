// pauseMusic: referencia al elemento de audio para la música de pausa
const pauseMusic = document.getElementById('pause-music');
pauseMusic.volume = 0.5; // Ajusta el volumen de la música de pausa al 50%
// backgroundMusic: referencia al elemento de audio para la música de fondo
const backgroundMusic = document.getElementById('background-music');
backgroundMusic.volume = 0.5; // Ajusta el volumen de la música de fondo al 50%
// Importa las clases que definen los objetos principales del juego
import Player from './player.js'; // Clase del jugador
import Obstacle from './Obstacle.js'; // Clase de obstáculos destructibles
import Bullet from './Bullet.js'; // Clase de balas del jugador
import IndestructibleObstacle from './IndestructibleObstacle.js'; // Clase de obstáculos indestructibles
import EnemyBullet from './EnemyBullet.js'; // Clase de balas enemigas

// startButton: referencia al botón de inicio
const startButton = document.getElementById('start-button');
// Evento click en el botón de inicio: inicia el juego
startButton.addEventListener('click', () => {
    console.log('Initiating protocol...'); // Mensaje de depuración
    // Inicia la música de fondo (promesa por si el navegador bloquea el autoplay)
    backgroundMusic.play().catch(error => {
        console.log('No se pudo reproducir música:', error.message); // Mensaje si falla
    });
    // Oculta la pantalla de inicio para mostrar el juego
    document.getElementById('start-screen').style.display = 'none';
    // gameScreen: referencia al contenedor principal del juego
    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.display = 'block'; // Muestra el área de juego
    // player: instancia del jugador, recibe el contenedor del juego
    const player = new Player(gameScreen);
    // Arrays para almacenar los objetos activos en el juego
    const obstacles = []; // Obstáculos destructibles (rosas)
    const indestructibleObstacles = []; // Obstáculos indestructibles (grises)
    const bullets = []; // Balas disparadas por el jugador
    const enemyBullets = []; // Balas disparadas por los obstáculos
    // Variables de estado del juego
    let gameOver = false; // true si el juego terminó
    let isPaused = false; // true si el juego está pausado
    let score = 0; // Puntuación actual del jugador
    // setInterval: crea obstáculos destructibles cada 1.5 segundos
    setInterval(() => {
        if (!gameOver && !isPaused) { // Solo si el juego está activo
            const obstacle = new Obstacle(gameScreen); // Nuevo obstáculo
            obstacles.push(obstacle); // Lo añade al array
            // shootInterval: cada obstáculo puede disparar cada 2 segundos
            const shootInterval = setInterval(() => {
                // Solo dispara si sigue en pantalla y con 50% de probabilidad
                if (!gameOver && !isPaused && obstacles.includes(obstacle) && Math.random() < 0.5) {
                    // enemyBullet: nueva bala enemiga, recibe posición y tamaño del obstáculo
                    const enemyBullet = new EnemyBullet(obstacle.left, obstacle.top, obstacle.width, obstacle.height);
                    enemyBullets.push(enemyBullet); // Añade la bala al array
                }
                // Si el obstáculo ya no existe, limpia el intervalo
                if (!obstacles.includes(obstacle)) {
                    clearInterval(shootInterval);
                }
            }, 2000); // Cada 2 segundos
        }
    }, 1500); // Cada 1.5 segundos
    // setInterval: crea obstáculos indestructibles cada 3 segundos
    setInterval(() => {
        if (!gameOver && !isPaused) {
            const indestructibleObstacle = new IndestructibleObstacle(); // Nuevo obstáculo gris
            indestructibleObstacles.push(indestructibleObstacle); // Añade al array
        }
    }, 3000); // Cada 3 segundos
    // Control de teclado: detecta teclas presionadas
    document.addEventListener('keydown', (event) => {
        // Disparo con barra espaciadora
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault(); // Evita scroll de página
            if (!gameOver && !isPaused) {
                // bullet: nueva bala del jugador
                const bullet = new Bullet(gameScreen, player.left, player.top, player.width);
                bullets.push(bullet); // Añade la bala al array
            }
            return;
        }
        // Pausa con 'P' (mayúscula o minúscula)
        if (event.key.toLowerCase() === 'p') {
            isPaused = !isPaused; // Alterna el estado de pausa
            if (isPaused) {
                backgroundMusic.pause(); // Pausa música de fondo
                pauseMusic.play(); // Reproduce música de pausa
                document.getElementById('paused-indicator').style.display = 'block'; // Muestra indicador
                console.log('PAUSED');
            } else {
                pauseMusic.pause(); // Pausa música de pausa
                backgroundMusic.play(); // Reanuda música de fondo
                document.getElementById('paused-indicator').style.display = 'none'; // Oculta indicador
                console.log('RESUMED');
            }
            return;
        }
        // Movimiento del jugador con flechas
        if (event.key === 'ArrowLeft') {
            player.directionX = -5; // Mueve a la izquierda
        }
        if (event.key === 'ArrowRight') {
            player.directionX = 5; // Mueve a la derecha
        }
        if (event.key === 'ArrowUp') {
            player.directionY = -5; // Mueve arriba
        }
        if (event.key === 'ArrowDown') {
            player.directionY = 5; // Mueve abajo
        }
    });
    // Control de teclado: detecta teclas soltadas
    document.addEventListener('keyup', (event) => {
        // Detiene movimiento horizontal
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            player.directionX = 0;
        }
        // Detiene movimiento vertical
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            player.directionY = 0;
        }
    });
    // gameLoop: función principal que actualiza el juego 60 veces por segundo
    function gameLoop() {
        if (gameOver) return; // Si el juego terminó, no hace nada
        // Si está pausado, espera al siguiente frame
        if (isPaused) {
            requestAnimationFrame(gameLoop);
            return;
        }
        // Mueve el jugador según su dirección
        player.move();
        // Mueve todas las balas del jugador
        bullets.forEach((bullet, bulletIndex) => {
            bullet.move(); // Actualiza posición
            // Verifica colisión entre bala y obstáculos destructibles
            obstacles.forEach((obstacle, obstacleIndex) => {
                if (bullet.didCollide(obstacle)) {
                    // Si colisiona, elimina la bala y el obstáculo
                    bullet.remove();
                    bullets.splice(bulletIndex, 1);
                    obstacle.remove();
                    obstacles.splice(obstacleIndex, 1);
                    score++; // Suma punto por destruir obstáculo
                    document.getElementById('score-display').textContent = `SCORE: ${score}`;
                    console.log('Obstacle destroyed! Score:', score);
                }
            });
            // Elimina balas que salen de la pantalla
            if (bullet.isOffScreen()) {
                bullet.remove();
                bullets.splice(bulletIndex, 1);
            }
        });
        // Mueve todos los obstáculos destructibles
        obstacles.forEach((obstacle, index) => {
            obstacle.move(); // Actualiza posición
            // Verifica colisión con el jugador
            if (player.didCollide(obstacle)) {
                gameOver = true; // Termina el juego
                showGameOver(); // Muestra pantalla de GAME OVER
                return;
            }
            // Si el obstáculo sale de la pantalla, termina el juego
            if (obstacle.isOffScreen()) {
                obstacle.remove();
                obstacles.splice(index, 1);
                gameOver = true;
                showGameOver();
                return;
            }
        });
        // Mueve todos los obstáculos indestructibles
        indestructibleObstacles.forEach((obstacle, index) => {
            obstacle.move(); // Actualiza posición
            // Verifica colisión con el jugador
            if (player.didCollide(obstacle)) {
                gameOver = true;
                showGameOver();
                return;
            }
            // Elimina si sale de la pantalla
            if (obstacle.isOffScreen()) {
                obstacle.remove();
                indestructibleObstacles.splice(index, 1);
            }
        });
        // Mueve todas las balas enemigas
        enemyBullets.forEach((enemyBullet, index) => {
            enemyBullet.move(); // Actualiza posición
            // Verifica colisión con el jugador
            if (enemyBullet.didCollide(player)) {
                gameOver = true;
                showGameOver();
                return;
            }
            // Elimina si sale de la pantalla
            if (enemyBullet.isOffScreen()) {
                enemyBullet.remove();
                enemyBullets.splice(index, 1);
            }
        });
        requestAnimationFrame(gameLoop); // Solicita el siguiente frame
    }
    gameLoop(); // Inicia el bucle principal
    // showGameOver: muestra la pantalla de GAME OVER y la puntuación
    function showGameOver() {
        gameScreen.style.display = 'none'; // Oculta el área de juego
        document.getElementById('game-over-screen').style.display = 'flex'; // Muestra GAME OVER
        // Pausa ambas músicas
        backgroundMusic.pause();
        pauseMusic.pause();
        // Muestra la puntuación final en pantalla y consola
        console.log('Game Over! Score value:', score);
        document.getElementById('final-score').textContent = `Score: ${score}`;
    }
});
// Evento click en el botón de reinicio
// Recarga la página para reiniciar el juego desde cero
document.getElementById('reboot-button').addEventListener('click', () => {
    location.reload(); // Recarga la página
});