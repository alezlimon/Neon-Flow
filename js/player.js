// Player class
export default class Player {
    constructor(gameScreen) {
        this.gameScreen = gameScreen;
        this.width = 20;
        this.height = 20;
        this.left = (this.gameScreen.offsetWidth - this.width) / 2;
        this.top = this.gameScreen.offsetHeight - this.height - 24;
        this.directionX = 0;
        this.directionY = 0;
        this.element = null;
        this.fragments = [];

        this.createDOMElement();
    }

    createDOMElement() {
        this.element = document.createElement('div');
        this.element.className = 'player-core';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;

        const fragmentMap = [
            [2, 3], [8, 3], [14, 3],
            [2, 9], [8, 9], [14, 9],
            [2, 15], [8, 15], [14, 15]
        ];

        fragmentMap.forEach(([x, y], index) => {
            const fragment = document.createElement('div');
            fragment.className = 'player-fragment';
            fragment.style.left = `${x}px`;
            fragment.style.top = `${y}px`;
            fragment.dataset.index = `${index}`;
            this.element.appendChild(fragment);
            this.fragments.push(fragment);
        });

        this.gameScreen.appendChild(this.element);
    }

    updateIntegrity(health, maxHealth) {
        const missing = Math.max(0, maxHealth - health);
        const removalPatterns = {
            0: [],
            1: [8],
            2: [8, 2, 6],
            3: [8, 2, 6, 1, 7],
            4: [8, 2, 6, 1, 7, 0, 5],
            5: [8, 2, 6, 1, 7, 0, 5, 3, 4]
        };

        const removed = new Set(removalPatterns[Math.min(5, missing)]);
        this.fragments.forEach((fragment, index) => {
            if (removed.has(index)) {
                fragment.classList.add('fragment-gone');
            } else {
                fragment.classList.remove('fragment-gone');
            }
        });
    }

    showCorruptionFlash() {
        this.element.classList.add('player-corrupted');
        setTimeout(() => {
            this.element.classList.remove('player-corrupted');
        }, 180);
    }

    move() {
        this.left += this.directionX;
        this.top += this.directionY;

        if (this.left < 0) this.left = 0;
        if (this.left > this.gameScreen.offsetWidth - this.width) {
            this.left = this.gameScreen.offsetWidth - this.width;
        }
        if (this.top < 0) this.top = 0;
        if (this.top > this.gameScreen.offsetHeight - this.height) {
            this.top = this.gameScreen.offsetHeight - this.height;
        }

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

    didCollide(obstacle) {
        return (
            this.left < obstacle.left + obstacle.width &&
            this.left + this.width > obstacle.left &&
            this.top < obstacle.top + obstacle.height &&
            this.top + this.height > obstacle.top
        );
    }
}