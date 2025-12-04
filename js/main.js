const pauseMusic = document.getElementById('pause-music');
pauseMusic.volume = 0.5; // Volumen más bajo para pausa
// Get audio element
const backgroundMusic = document.getElementById('background-music');
backgroundMusic.volume = 0.5; // Volumen al 50%
// Import classes
import Player from './Player.js';
import Obstacle from './Obstacle.js';
import Bullet from './Bullet.js';
import IndestructibleObstacle from './IndestructibleObstacle.js';
import EnemyBullet from './EnemyBullet.js';


// Star Button
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
    console.log('Initiating protocol...');
    
    // Iniciar música
    backgroundMusic.play().catch(error => {
        console.log('No se pudo reproducir música:', error.message);
    });
    
    // Hide start screen
    document.getElementById('start-screen').style.display = 'none';
    
    // Get game screen element and show it
    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.display = 'block';
    
    // Create new player instance
    const player = new Player(gameScreen);
    
    // Obstacles array
    const obstacles = [];
    
    // Indestructible obstacles array
    const indestructibleObstacles = [];
    
    // Bullets array
    const bullets = [];
    
    // Enemy bullets array
    const enemyBullets = [];
    
    // Game state
    let gameOver = false;
    let isPaused = false;
    let score = 0; // Puntos del jugador
    
    // Create obstacles every 1.5 seconds
    setInterval(() => {
        if (!gameOver && !isPaused) {
            const obstacle = new Obstacle(gameScreen);
            obstacles.push(obstacle);
            
            // Cada obstáculo tiene 50% de probabilidad de disparar cada 2 segundos
            const shootInterval = setInterval(() => {
                if (!gameOver && !isPaused && obstacles.includes(obstacle) && Math.random() < 0.5) {
                    const enemyBullet = new EnemyBullet(obstacle.left, obstacle.top, obstacle.width, obstacle.height);
                    enemyBullets.push(enemyBullet);
                }
                // Limpiar intervalo si el obstáculo ya no existe
                if (!obstacles.includes(obstacle)) {
                    clearInterval(shootInterval);
                }
            }, 2000);
        }
    }, 1500);
    
    // Create indestructible obstacles every 3 seconds
    setInterval(() => {
        if (!gameOver && !isPaused) {
            const indestructibleObstacle = new IndestructibleObstacle();
            indestructibleObstacles.push(indestructibleObstacle);
        }
    }, 3000);
    

    // Disparo manual con barra espaciadora

    
    // Keyboard controls (Arrow Keys)
    document.addEventListener('keydown', (event) => {
        // Disparar con barra espaciadora
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault(); // Evitar scroll de página
            if (!gameOver && !isPaused) {
                const bullet = new Bullet(gameScreen, player.left, player.top, player.width);
                bullets.push(bullet);
            }
            return;
        }
        // Pausar con 'P'
        if (event.key.toLowerCase() === 'p') {
            isPaused = !isPaused;
            if (isPaused) {
                backgroundMusic.pause();
                pauseMusic.play();
                document.getElementById('paused-indicator').style.display = 'block';
                console.log('PAUSED');
            } else {
                pauseMusic.pause();
                backgroundMusic.play();
                document.getElementById('paused-indicator').style.display = 'none';
                console.log('RESUMED');
            }
            return;
        }
        if (event.key === 'ArrowLeft') {
            player.directionX = -5;
        }
        if (event.key === 'ArrowRight') {
            player.directionX = 5;
        }
        if (event.key === 'ArrowUp') {
            player.directionY = -5;
        }
        if (event.key === 'ArrowDown') {
            player.directionY = 5;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            player.directionX = 0;
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            player.directionY = 0;
        }
    });

    // Game loop - runs 60 times per second
    function gameLoop() {
        if (gameOver) return; // Stop if game over
        
        // Pausar si está pausado
        if (isPaused) {
            requestAnimationFrame(gameLoop);
            return;
        }
        
        // Move player
        player.move();
        
        // Move all bullets
        bullets.forEach((bullet, bulletIndex) => {
            bullet.move();
            
            // Check collision with obstacles
            obstacles.forEach((obstacle, obstacleIndex) => {
                if (bullet.didCollide(obstacle)) {
                    // Eliminar bala y obstáculo
                    bullet.remove();
                    bullets.splice(bulletIndex, 1);
                    obstacle.remove();
                    obstacles.splice(obstacleIndex, 1);
                    score++; // ¡+1 punto por destruir obstáculo!
                    document.getElementById('score-display').textContent = `SCORE: ${score}`;
                    console.log('Obstacle destroyed! Score:', score);
                }
            });
            
            // Remove bullets that are off screen
            if (bullet.isOffScreen()) {
                bullet.remove();
                bullets.splice(bulletIndex, 1);
            }
        });
        
        // Move all obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.move();
            
            // Check collision with player
            if (player.didCollide(obstacle)) {
                gameOver = true;
                showGameOver();
                return;
            }
            
            // Remove obstacles that are off screen - GAME OVER si escapan
            if (obstacle.isOffScreen()) {
                obstacle.remove();           // Eliminar del DOM
                obstacles.splice(index, 1);  // Eliminar del array
                gameOver = true;             // GAME OVER - el obstáculo escapó
                showGameOver();
                return;
            }
        });
        
        // Move all indestructible obstacles
        indestructibleObstacles.forEach((obstacle, index) => {
            obstacle.move();
            
            // Check collision with player
            if (player.didCollide(obstacle)) {
                gameOver = true;
                showGameOver();
                return;
            }
            
            // Remove if off screen (no score for these)
            if (obstacle.isOffScreen()) {
                obstacle.remove();
                indestructibleObstacles.splice(index, 1);
            }
        });
        
        // Move all enemy bullets
        enemyBullets.forEach((enemyBullet, index) => {
            enemyBullet.move();
            
            // Check collision with player
            if (enemyBullet.didCollide(player)) {
                gameOver = true;
                showGameOver();
                return;
            }
            
            // Remove if off screen
            if (enemyBullet.isOffScreen()) {
                enemyBullet.remove();
                enemyBullets.splice(index, 1);
            }
        });
        
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
    
    // Show game over screen
    function showGameOver() {
        gameScreen.style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'flex';
        
        // Pausar músicas del juego
        backgroundMusic.pause();
        pauseMusic.pause();
        
        
        // Mostrar puntuación final
        console.log('Game Over! Score value:', score);
        document.getElementById('final-score').textContent = `Score: ${score}`;
    }
});

// Reboot button
document.getElementById('reboot-button').addEventListener('click', () => {
    location.reload(); // Reload page to restart
});