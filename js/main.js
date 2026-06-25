const pauseMusic = document.getElementById('pause-music');
pauseMusic.volume = 0.5; // Volumen más bajo para pausa
// Get audio element
const backgroundMusic = document.getElementById('background-music');
backgroundMusic.volume = 0.5; // Volumen al 50%
const gameStage = document.getElementById('game-stage');
const pausedIndicator = document.getElementById('paused-indicator');
const ambientScore = document.getElementById('ambient-score');
const sectorDisplay = document.getElementById('sector-display');
const objectiveDisplay = document.getElementById('objective-display');
const loreFeed = document.getElementById('lore-feed');
const weaponToast = document.getElementById('weapon-toast');
const sectorBriefing = document.getElementById('sector-briefing');
const sectorBriefingText = document.getElementById('sector-briefing-text');
const sectorBriefingContinue = document.getElementById('sector-briefing-continue');
const upgradePanel = document.getElementById('upgrade-panel');
const upgradeOptionA = document.getElementById('upgrade-option-a');
const upgradeOptionB = document.getElementById('upgrade-option-b');
// Import classes
import Player from './Player.js';
import Obstacle from './Obstacle.js';
import Bullet from './Bullet.js';
import BeamBullet from './BeamBullet.js';
import HaloBeamBullet from './HaloBeamBullet.js';
import EliteObstacle from './EliteObstacle.js';
import IndestructibleObstacle from './IndestructibleObstacle.js';
import EnemyBullet from './EnemyBullet.js';
import Pickup from './Pickup.js';

const AUTO_FIRE_INTERVAL_MS = 320;
const MAX_HEALTH = 5;
const DAMAGE_COOLDOWN_MS = 700;
const BASE_OBSTACLE_INTERVAL_MS = 1200;
const BASE_INDESTRUCTIBLE_INTERVAL_MS = 2600;
const EVENT_CHECK_INTERVAL_MS = 4000;
const EVENT_DURATION_MS = 9500;

const WEAPON_TIERS = [
  { name: 'Pulse Needle', scoreMin: 0, scoreMax: 14 },
  { name: 'Twin Divergence', scoreMin: 15, scoreMax: 49 },
  { name: 'Core Beam', scoreMin: 50, scoreMax: 99 },
  { name: 'Halo Beam', scoreMin: 100, scoreMax: Infinity }
];

const LORE_STORAGE_KEY = 'neon-flow-lore-fragments';
const LORE_FRAGMENTS = {
    1: 'Fragmento 01: El Perimetro era verde antes del colapso.',
    2: 'Fragmento 02: La Malla Corrupta aprende de tus patrones.',
    3: 'Fragmento 03: El Nucleo Espectral contiene memoria humana.',
    4: 'Fragmento 04: Tormenta Fantasma // El sistema no perdona.'
};


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
    gameStage.style.display = 'flex';
    
    // Create new player instance
    const player = new Player(gameScreen);
    
    // Obstacles array
    const obstacles = [];
    
    // Indestructible obstacles array
    const indestructibleObstacles = [];
    
    // Bullets array
    const bullets = [];

    // Elite obstacles array
    const eliteObstacles = [];
    
    // Enemy bullets array
    const enemyBullets = [];

    // Pickups array
    const pickups = [];
    
    // Game state
    let gameOver = false;
    let isPaused = false;
    let score = 0; // Puntos del jugador
    let weaponTier = 0;
    let weaponTierChanged = false;
    let health = MAX_HEALTH;
    let shield = 0;
    let damageCooldownUntil = 0;
    let fireCounter = 0;
    let activeBeams = { tier2: null, tier3: null };
    let weaponToastTimeout = null;
    let sectorLevel = 1;
    let sectorProgress = 0;
    let sectorObjectiveTarget = 12;
    let activeEvent = null;
    let eventCooldownUntil = Date.now() + 10000;
    let isSectorBossActive = false;
    let pendingSectorLevel = null;
    let isChoosingUpgrade = false;
    let isBriefingOpen = false;
    let damageCooldownMs = DAMAGE_COOLDOWN_MS;
    let shieldReachBonus = 0;
    let pickupChanceBonus = 0;
    let cadenceBonusChance = 0;
    let unlockedLore = [];
    let loreFeedTimeout = null;
    let pendingUpgradeChoices = [];
    let freezeUntil = 0;
    const keyState = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false
    };

    function updateScoreDisplay() {
        if (ambientScore) {
            ambientScore.textContent = String(score).padStart(6, '0');
            ambientScore.classList.remove('score-glitch');
            void ambientScore.offsetWidth;
            ambientScore.classList.add('score-glitch');
        }
    }

    function updateShieldVisual() {
        if (shield > 0) {
            player.element.classList.add('shield-active');
        } else {
            player.element.classList.remove('shield-active');
        }
    }

    function showWeaponToast(label) {
        if (!weaponToast) {
            return;
        }

        weaponToast.textContent = label;
        weaponToast.classList.add('visible');

        if (weaponToastTimeout) {
            clearTimeout(weaponToastTimeout);
        }

        weaponToastTimeout = setTimeout(() => {
            weaponToast.classList.remove('visible');
            weaponToastTimeout = null;
        }, 700);
    }

    function applySectorTheme(level) {
        gameScreen.classList.remove('sector-1', 'sector-2', 'sector-3', 'sector-4', 'sector-5', 'sector-6');
        const themeLevel = Math.min(6, Math.max(1, level));
        gameScreen.classList.add(`sector-${themeLevel}`);
    }

    function hideSectorBriefing() {
        if (sectorBriefing) {
            sectorBriefing.style.display = 'none';
        }
        isBriefingOpen = false;
    }

    function showSectorBriefing(nextSectorLevel) {
        if (!sectorBriefing || !sectorBriefingText) {
            showUpgradeChoice(nextSectorLevel);
            return;
        }

        const latestLore = unlockedLore.slice(-3);
        const loreBlock = latestLore.length > 0
            ? latestLore.join('\n')
            : 'Sin registros recuperados en este ciclo.';

        sectorBriefingText.textContent =
            `Destino: Sector ${nextSectorLevel} // ${getSectorName(nextSectorLevel)}\n` +
            `\nUltimos fragmentos:\n${loreBlock}`;

        sectorBriefing.style.display = 'flex';
        isBriefingOpen = true;
    }

    function loadLoreMemory() {
        try {
            const raw = window.localStorage.getItem(LORE_STORAGE_KEY);
            if (!raw) {
                unlockedLore = [];
                return;
            }
            const parsed = JSON.parse(raw);
            unlockedLore = Array.isArray(parsed) ? parsed : [];
        } catch {
            unlockedLore = [];
        }
    }

    function persistLoreMemory() {
        try {
            window.localStorage.setItem(LORE_STORAGE_KEY, JSON.stringify(unlockedLore));
        } catch {
            // Ignore storage issues and keep run playable.
        }
    }

    function showLoreFragment(text) {
        if (!loreFeed) {
            return;
        }

        loreFeed.textContent = text;
        loreFeed.classList.add('visible');
        if (loreFeedTimeout) {
            clearTimeout(loreFeedTimeout);
        }

        loreFeedTimeout = setTimeout(() => {
            loreFeed.classList.remove('visible');
            loreFeedTimeout = null;
        }, 3200);
    }

    function unlockLoreForSector(level) {
        const fragment = LORE_FRAGMENTS[level] || `Fragmento ${String(level).padStart(2, '0')}: Nexo ${level} comprometido.`;
        if (unlockedLore.includes(fragment)) {
            showLoreFragment(fragment);
            return;
        }

        unlockedLore.push(fragment);
        persistLoreMemory();
        showLoreFragment(fragment);
    }

    function buildUpgradePool() {
        return [
            {
                id: 'cadence-overclock',
                label: '[1] Overclock de Cadencia',
                detail: '+35% prob. de rafaga extra por disparo',
                apply: () => {
                    cadenceBonusChance = Math.min(0.7, cadenceBonusChance + 0.15);
                }
            },
            {
                id: 'shield-lattice',
                label: '[2] Malla de Escudo',
                detail: '+6 de alcance y escudo instantaneo',
                apply: () => {
                    shieldReachBonus += 6;
                    shield = 1;
                    updateShieldVisual();
                }
            },
            {
                id: 'recovery-patch',
                label: '[3] Recovery Patch',
                detail: '+1 de vida y cooldown de dano reducido',
                apply: () => {
                    health = Math.min(MAX_HEALTH, health + 1);
                    damageCooldownMs = Math.max(350, damageCooldownMs - 70);
                    player.updateIntegrity(health, MAX_HEALTH);
                }
            },
            {
                id: 'supply-sniffer',
                label: '[4] Sniffer de Suministros',
                detail: '+12% probabilidad de pickup',
                apply: () => {
                    pickupChanceBonus = Math.min(0.45, pickupChanceBonus + 0.12);
                }
            }
        ];
    }

    function chooseRandomUpgrades() {
        const pool = buildUpgradePool();
        for (let i = pool.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool.slice(0, 2);
    }

    function hideUpgradePanel() {
        if (upgradePanel) {
            upgradePanel.style.display = 'none';
        }
        pendingUpgradeChoices = [];
        isChoosingUpgrade = false;
    }

    function continueAfterBriefing() {
        if (!isBriefingOpen) {
            return;
        }

        hideSectorBriefing();
        const nextLevel = pendingSectorLevel || (sectorLevel + 1);
        showUpgradeChoice(nextLevel);
    }

    function applyUpgradeByIndex(index) {
        const selected = pendingUpgradeChoices[index];
        if (!selected) {
            return;
        }

        selected.apply();
        showWeaponToast(`${selected.label} aplicado`);
        hideUpgradePanel();

        if (pendingSectorLevel !== null) {
            startSector(pendingSectorLevel);
            pendingSectorLevel = null;
        }
    }

    function showUpgradeChoice(nextSectorLevel) {
        pendingSectorLevel = nextSectorLevel;
        isChoosingUpgrade = true;
        pendingUpgradeChoices = chooseRandomUpgrades();

        if (!upgradePanel || !upgradeOptionA || !upgradeOptionB) {
            applyUpgradeByIndex(0);
            return;
        }

        upgradeOptionA.textContent = `${pendingUpgradeChoices[0].label} // ${pendingUpgradeChoices[0].detail}`;
        upgradeOptionB.textContent = `${pendingUpgradeChoices[1].label} // ${pendingUpgradeChoices[1].detail}`;
        upgradePanel.style.display = 'flex';
    }

    function getSectorName(level) {
        const names = ['Perimetro Verde', 'Malla Corrupta', 'Nucleo Espectral', 'Tormenta Fantasma'];
        if (level <= names.length) {
            return names[level - 1];
        }
        return `Nexo ${level}`;
    }

    function getSectorObjectiveTarget(level) {
        return 12 + (level - 1) * 6;
    }

    function updateSectorDisplay() {
        if (sectorDisplay) {
            sectorDisplay.textContent = `SECTOR ${sectorLevel} // ${getSectorName(sectorLevel)}`;
        }
        if (objectiveDisplay) {
            objectiveDisplay.textContent = isSectorBossActive
                ? 'OBJETIVO // ELITE NODE'
                : `PURGA ${sectorProgress}/${sectorObjectiveTarget}`;
        }
    }

    function startSector(level) {
        sectorLevel = level;
        sectorProgress = 0;
        sectorObjectiveTarget = getSectorObjectiveTarget(level);
        isSectorBossActive = false;
        applySectorTheme(level);
        hideSectorBriefing();
        updateSectorDisplay();
        showWeaponToast(`Sector ${sectorLevel}: ${getSectorName(sectorLevel)}`);
        unlockLoreForSector(level);
    }

    function completeSectorObjective() {
        const nextLevel = sectorLevel + 1;
        showWeaponToast('Nodo elite destruido // sincroniza mejora');
        showSectorBriefing(nextLevel);
        pendingSectorLevel = nextLevel;
    }

    function registerPurgeProgress() {
        if (isSectorBossActive) {
            return;
        }

        sectorProgress += 1;
        if (sectorProgress === Math.floor(sectorObjectiveTarget / 2)) {
            showWeaponToast('Se detecta resistencia del sistema...');
        }
        if (sectorProgress >= sectorObjectiveTarget) {
            spawnSectorBoss();
            return;
        }
        updateSectorDisplay();
    }

    function spawnSectorBoss() {
        if (isSectorBossActive) {
            return;
        }

        isSectorBossActive = true;
        updateSectorDisplay();
        showWeaponToast(`ALERTA // Elite Node Sector ${sectorLevel}`);
        const elite = new EliteObstacle(gameScreen, sectorLevel);
        eliteObstacles.push(elite);
    }

    function showBossDefeatReward() {
        freezeUntil = Date.now() + 110;
        gameScreen.classList.add('boss-freeze');

        const burst = document.createElement('div');
        burst.className = 'boss-defeat-burst';
        const centerX = player.left + player.width / 2;
        const centerY = player.top + player.height / 2;
        burst.style.left = `${centerX - 42}px`;
        burst.style.top = `${centerY - 42}px`;
        gameScreen.appendChild(burst);

        setTimeout(() => {
            gameScreen.classList.remove('boss-freeze');
            burst.remove();
        }, 260);
    }

    function onSectorBossDefeated() {
        isSectorBossActive = false;
        showBossDefeatReward();
        score += 8;
        updateScoreDisplay();
        updateWeaponTier();
        completeSectorObjective();
    }

    function getEnemyFireChance() {
        let chance = Math.min(0.35 + sectorLevel * 0.05, 0.85);
        if (activeEvent && activeEvent.id === 'firewall-rain') {
            chance = Math.min(0.95, chance + 0.2);
        }
        return chance;
    }

    function getSpawnBurstCount() {
        let count = 1;
        if (Math.random() < Math.min(0.22 + sectorLevel * 0.05, 0.72)) {
            count += 1;
        }
        if (activeEvent && activeEvent.id === 'firewall-rain') {
            count += 1;
        }
        return count;
    }

    function maybeTriggerEvent() {
        const now = Date.now();
        if (gameOver || isPaused || activeEvent || now < eventCooldownUntil) {
            return;
        }

        const chance = Math.min(0.16 + sectorLevel * 0.03, 0.42);
        if (Math.random() >= chance) {
            return;
        }

        activeEvent = {
            id: 'firewall-rain',
            label: 'Evento: Firewall Rain',
            endsAt: now + EVENT_DURATION_MS
        };
        showWeaponToast(`${activeEvent.label} // Sobrevive`);
    }

    function updateEventLifecycle() {
        if (!activeEvent) {
            return;
        }

        const now = Date.now();
        if (now >= activeEvent.endsAt) {
            activeEvent = null;
            eventCooldownUntil = now + 12000;
            showWeaponToast('Evento finalizado // Flujo estabilizado');
        }
    }

    function getWeaponTier() {
        for (let i = WEAPON_TIERS.length - 1; i >= 0; i -= 1) {
            const tier = WEAPON_TIERS[i];
            if (score >= tier.scoreMin) {
                return i;
            }
        }
        return 0;
    }

    function updateWeaponTier() {
        const newTier = getWeaponTier();
        if (newTier !== weaponTier) {
            weaponTier = newTier;
            weaponTierChanged = true;
            showWeaponToast(WEAPON_TIERS[weaponTier].name);
        }
    }

    function maybeSpawnPickup(left, top) {
        const pickupChance = Math.min(0.75, 0.3 + pickupChanceBonus);
        if (Math.random() >= pickupChance) {
            return;
        }

        const availableTypes = ['shield'];
        if (health < MAX_HEALTH) {
            availableTypes.push('health');
        }

        const pickupType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        const pickup = new Pickup(gameScreen, pickupType, left, top);
        pickups.push(pickup);
    }

    function awardPickup(pickupType) {
        if (pickupType === 'health') {
            health = Math.min(MAX_HEALTH, health + 1);
            player.updateIntegrity(health, MAX_HEALTH);
            return;
        }

        if (pickupType === 'shield') {
            // Shield activates immediately on pickup and stays as one active charge.
            shield = 1;
            updateShieldVisual();
            return;
        }
    }

    function showShieldBreakEffect() {
        const playerCenterX = player.left + player.width / 2;
        const playerCenterY = player.top + player.height / 2;

        const burst = document.createElement('div');
        burst.className = 'shield-break-burst';
        burst.style.left = `${playerCenterX - 24}px`;
        burst.style.top = `${playerCenterY - 24}px`;
        gameScreen.appendChild(burst);

        player.element.classList.add('shield-break-flash');
        setTimeout(() => {
            player.element.classList.remove('shield-break-flash');
        }, 180);

        setTimeout(() => {
            burst.remove();
        }, 260);
    }

    function consumeShieldOnHit() {
        if (shield <= 0) {
            return false;
        }

        showShieldBreakEffect();
        shield = 0;
        updateShieldVisual();
        return true;
    }

    function didCollideWithShieldReach(target) {
        const reachPadding = shield > 0 ? 10 + shieldReachBonus : 0;
        return (
            player.left - reachPadding < target.left + target.width &&
            player.left + player.width + reachPadding > target.left &&
            player.top - reachPadding < target.top + target.height &&
            player.top + player.height + reachPadding > target.top
        );
    }

    function applyDamage(amount) {
        const now = Date.now();
        if (now < damageCooldownUntil || gameOver) {
            return false;
        }

        damageCooldownUntil = now + damageCooldownMs;
        player.showCorruptionFlash();

        if (amount > 0) {
            health = Math.max(0, health - amount);
            player.updateIntegrity(health, MAX_HEALTH);
        }

        if (health <= 0) {
            gameOver = true;
            showGameOver();
        }

        return true;
    }

    function destroyObstacle(obstacleIndex) {
        const obstacle = obstacles[obstacleIndex];
        if (!obstacle) {
            return;
        }

        const spawnLeft = obstacle.left + obstacle.width / 2;
        const spawnTop = obstacle.top + obstacle.height / 2;
        obstacle.remove();
        obstacles.splice(obstacleIndex, 1);
        score += 1;
        updateScoreDisplay();
        updateWeaponTier();
        registerPurgeProgress();
        maybeSpawnPickup(spawnLeft, spawnTop);
    }

    function clearActiveBeamRefs(bullet) {
        if (activeBeams.tier2 === bullet) {
            activeBeams.tier2 = null;
        }

        if (activeBeams.tier3 === bullet) {
            activeBeams.tier3 = null;
        }
    }

    function firePrimaryWeapon() {
        if (weaponTier === 0) {
            const bullet = new Bullet(gameScreen, player.left, player.top, player.width, 0);
            bullets.push(bullet);
        } else if (weaponTier === 1) {
            const leftBullet = new Bullet(gameScreen, player.left - 8, player.top, player.width, -0.5);
            const rightBullet = new Bullet(gameScreen, player.left + 8, player.top, player.width, +0.5);
            bullets.push(leftBullet, rightBullet);
        } else if (weaponTier === 2) {
            // Keep one persistent center beam and avoid recreating it every cycle.
            if (!activeBeams.tier2) {
                const beam = new BeamBullet(gameScreen, player.left + player.width / 2, player.top);
                activeBeams.tier2 = beam;
                bullets.push(beam);
            }

            if (activeBeams.tier3) {
                activeBeams.tier3.remove();
                const tier3Index = bullets.indexOf(activeBeams.tier3);
                if (tier3Index > -1) bullets.splice(tier3Index, 1);
                activeBeams.tier3 = null;
            }
        } else if (weaponTier === 3) {
            // Keep persistent beams so halo projectile can actually advance upward.
            if (!activeBeams.tier2) {
                const centerBeam = new BeamBullet(gameScreen, player.left + player.width / 2, player.top);
                activeBeams.tier2 = centerBeam;
                bullets.push(centerBeam);
            }

            if (!activeBeams.tier3) {
                const haloBeam = new HaloBeamBullet(gameScreen, player.left + player.width / 2, player.top);
                activeBeams.tier3 = haloBeam;
                bullets.push(haloBeam);
            }
        }
    }

    if (upgradeOptionA && upgradeOptionB) {
        upgradeOptionA.onclick = () => applyUpgradeByIndex(0);
        upgradeOptionB.onclick = () => applyUpgradeByIndex(1);
    }

    if (sectorBriefingContinue) {
        sectorBriefingContinue.onclick = () => continueAfterBriefing();
    }

    loadLoreMemory();

    updateScoreDisplay();
    updateShieldVisual();
    player.updateIntegrity(health, MAX_HEALTH);
    startSector(1);
    updateWeaponTier();

    // Auto-fire with rate adjustment based on weapon tier
    setInterval(() => {
        if (!gameOver && !isPaused) {
            fireCounter += 1;
            
            let shouldFire = true;
            if (weaponTier === 1) {
                // Twin Divergence: fire every 2 cycles (reduced cadence)
                shouldFire = fireCounter % 2 === 0;
            }
            
            if (shouldFire) {
                firePrimaryWeapon();
                if (cadenceBonusChance > 0 && Math.random() < cadenceBonusChance) {
                    firePrimaryWeapon();
                }
            }
        }
    }, AUTO_FIRE_INTERVAL_MS);
    
    function attachEnemyShooter(obstacle) {
        const shootIntervalMs = Math.max(850, 1900 - sectorLevel * 90);
        const shootInterval = setInterval(() => {
            if (!gameOver && !isPaused && obstacles.includes(obstacle) && Math.random() < getEnemyFireChance()) {
                const enemyBullet = new EnemyBullet(obstacle.left, obstacle.top, obstacle.width, obstacle.height);
                enemyBullets.push(enemyBullet);
            }
            if (!obstacles.includes(obstacle)) {
                clearInterval(shootInterval);
            }
        }, shootIntervalMs);
    }

    function fireEliteVolley() {
        if (gameOver || isPaused || isChoosingUpgrade || isBriefingOpen || eliteObstacles.length === 0) {
            return;
        }

        for (let i = 0; i < eliteObstacles.length; i += 1) {
            const elite = eliteObstacles[i];
            const profile = elite.getAttackProfile();
            elite.startTelegraph(profile.telegraphMs);

            setTimeout(() => {
                if (gameOver || isPaused || !eliteObstacles.includes(elite)) {
                    return;
                }

                for (let j = 0; j < profile.spread.length; j += 1) {
                    const volleyBullet = new EnemyBullet(
                        elite.left,
                        elite.top,
                        elite.width,
                        elite.height,
                        {
                            velocityX: profile.spread[j],
                            velocityY: profile.speed,
                            color: profile.color,
                            height: profile.height,
                            width: profile.width
                        }
                    );
                    enemyBullets.push(volleyBullet);
                }
            }, profile.telegraphMs);
        }
    }

    // Dynamic obstacle spawner driven by sector progression.
    setInterval(() => {
        if (gameOver || isPaused || isChoosingUpgrade || isBriefingOpen) {
            return;
        }

        const bursts = getSpawnBurstCount();
        for (let i = 0; i < bursts; i += 1) {
            const obstacle = new Obstacle(gameScreen);
            obstacles.push(obstacle);
            attachEnemyShooter(obstacle);
        }
    }, BASE_OBSTACLE_INTERVAL_MS);

    // Indestructible hazards scale with sector pressure.
    setInterval(() => {
        if (gameOver || isPaused || isChoosingUpgrade || isBriefingOpen) {
            return;
        }

        let hazardChance = Math.min(0.18 + sectorLevel * 0.06, 0.7);
        if (activeEvent && activeEvent.id === 'firewall-rain') {
            hazardChance = Math.min(0.9, hazardChance + 0.2);
        }

        if (Math.random() < hazardChance) {
            const indestructibleObstacle = new IndestructibleObstacle();
            indestructibleObstacles.push(indestructibleObstacle);
        }
    }, BASE_INDESTRUCTIBLE_INTERVAL_MS);

    setInterval(() => {
        if (!isChoosingUpgrade && !isBriefingOpen) {
            maybeTriggerEvent();
        }
    }, EVENT_CHECK_INTERVAL_MS);

    setInterval(() => {
        fireEliteVolley();
    }, 1400);
    
    function syncPlayerDirectionFromKeys() {
        if (keyState.ArrowLeft && !keyState.ArrowRight) {
            player.directionX = -5;
        } else if (keyState.ArrowRight && !keyState.ArrowLeft) {
            player.directionX = 5;
        } else {
            player.directionX = 0;
        }

        if (keyState.ArrowUp && !keyState.ArrowDown) {
            player.directionY = -5;
        } else if (keyState.ArrowDown && !keyState.ArrowUp) {
            player.directionY = 5;
        } else {
            player.directionY = 0;
        }
    }

    // Keyboard controls (Arrow Keys)
    document.addEventListener('keydown', (event) => {
        // Pausar con 'P'
        if (event.key.toLowerCase() === 'p') {
            if (isChoosingUpgrade || isBriefingOpen) {
                return;
            }
            isPaused = !isPaused;
            if (isPaused) {
                backgroundMusic.pause();
                pauseMusic.play();
                pausedIndicator.style.display = 'block';
                console.log('PAUSED');
            } else {
                pauseMusic.pause();
                backgroundMusic.play();
                pausedIndicator.style.display = 'none';
                console.log('RESUMED');
            }
            return;
        }

        if (Object.prototype.hasOwnProperty.call(keyState, event.key)) {
            keyState[event.key] = true;
            syncPlayerDirectionFromKeys();
        }

        if (isBriefingOpen && event.key === 'Enter') {
            continueAfterBriefing();
        }

        if (isChoosingUpgrade && event.key === '1') {
            applyUpgradeByIndex(0);
        }
        if (isChoosingUpgrade && event.key === '2') {
            applyUpgradeByIndex(1);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (Object.prototype.hasOwnProperty.call(keyState, event.key)) {
            keyState[event.key] = false;
            syncPlayerDirectionFromKeys();
        }
    });

    // Game loop - runs 60 times per second
    function gameLoop() {
        if (gameOver) return; // Stop if game over
        
        // Pausar si está pausado
        if (isPaused || isChoosingUpgrade || isBriefingOpen) {
            requestAnimationFrame(gameLoop);
            return;
        }

        if (Date.now() < freezeUntil) {
            requestAnimationFrame(gameLoop);
            return;
        }

        updateEventLifecycle();
        
        // Move player
        player.move();
        
        // Move all bullets
        for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
            const bullet = bullets[bulletIndex];
            bullet.move();
            
            // Update beam position if it's a BeamBullet
            if (bullet.updatePosition) {
                bullet.updatePosition(player.left + player.width / 2, player.top);
            }
            
            // Check collision with obstacles
            for (let obstacleIndex = obstacles.length - 1; obstacleIndex >= 0; obstacleIndex -= 1) {
                const obstacle = obstacles[obstacleIndex];
                if (bullet.didCollide(obstacle)) {
                    bullet.remove();
                    clearActiveBeamRefs(bullet);
                    bullets.splice(bulletIndex, 1);
                    destroyObstacle(obstacleIndex);
                    console.log('Obstacle destroyed! Score:', score);
                    break;
                }
            }

            if (!bullets[bulletIndex]) {
                continue;
            }

            // Check collision with elite obstacles
            for (let eliteIndex = eliteObstacles.length - 1; eliteIndex >= 0; eliteIndex -= 1) {
                const elite = eliteObstacles[eliteIndex];
                if (bullet.didCollide(elite)) {
                    bullet.remove();
                    clearActiveBeamRefs(bullet);
                    bullets.splice(bulletIndex, 1);

                    if (elite.takeHit(1)) {
                        elite.remove();
                        eliteObstacles.splice(eliteIndex, 1);
                        onSectorBossDefeated();
                    }
                    break;
                }
            }
            
            // Remove bullets that are off screen
            if (bullets[bulletIndex] && bullet.isOffScreen()) {
                bullet.remove();
                clearActiveBeamRefs(bullet);
                bullets.splice(bulletIndex, 1);
            }
        }
        
        // Move all obstacles
        for (let index = obstacles.length - 1; index >= 0; index -= 1) {
            const obstacle = obstacles[index];
            obstacle.move();
            
            // Check collision with player
            if (didCollideWithShieldReach(obstacle)) {
                if (consumeShieldOnHit()) {
                    obstacle.remove();
                    obstacles.splice(index, 1);
                    continue;
                }

                if (applyDamage(1)) {
                    obstacle.remove();
                    obstacles.splice(index, 1);
                }
                continue;
            }
            
            // Hacer daño si el obstáculo atraviesa la línea de defensa
            if (obstacle.isOffScreen()) {
                obstacle.remove();
                obstacles.splice(index, 1);
                applyDamage(1);
            }
        }

        // Move all elite obstacles
        for (let index = eliteObstacles.length - 1; index >= 0; index -= 1) {
            const elite = eliteObstacles[index];
            elite.move();

            if (didCollideWithShieldReach(elite)) {
                if (consumeShieldOnHit()) {
                    elite.remove();
                    eliteObstacles.splice(index, 1);
                    onSectorBossDefeated();
                    continue;
                }

                if (applyDamage(2)) {
                    elite.remove();
                    eliteObstacles.splice(index, 1);
                }
                continue;
            }

            if (elite.isOffScreen()) {
                elite.remove();
                eliteObstacles.splice(index, 1);
            }
        }
        
        // Move all indestructible obstacles
        for (let index = indestructibleObstacles.length - 1; index >= 0; index -= 1) {
            const obstacle = indestructibleObstacles[index];
            obstacle.move();
            
            // Check collision with player
            if (didCollideWithShieldReach(obstacle)) {
                if (consumeShieldOnHit()) {
                    obstacle.remove();
                    indestructibleObstacles.splice(index, 1);
                    continue;
                }

                if (applyDamage(2)) {
                    obstacle.remove();
                    indestructibleObstacles.splice(index, 1);
                }
                continue;
            }
            
            // Remove if off screen (no score for these)
            if (obstacle.isOffScreen()) {
                obstacle.remove();
                indestructibleObstacles.splice(index, 1);
            }
        }
        
        // Move all enemy bullets
        for (let index = enemyBullets.length - 1; index >= 0; index -= 1) {
            const enemyBullet = enemyBullets[index];
            enemyBullet.move();
            
            // Check collision with player
            if (didCollideWithShieldReach(enemyBullet)) {
                if (consumeShieldOnHit()) {
                    enemyBullet.remove();
                    enemyBullets.splice(index, 1);
                    continue;
                }

                if (applyDamage(1)) {
                    enemyBullet.remove();
                    enemyBullets.splice(index, 1);
                }
                continue;
            }
            
            // Remove if off screen
            if (enemyBullet.isOffScreen()) {
                enemyBullet.remove();
                enemyBullets.splice(index, 1);
            }
        }

        for (let index = pickups.length - 1; index >= 0; index -= 1) {
            const pickup = pickups[index];
            pickup.move();

            if (pickup.didCollide(player)) {
                awardPickup(pickup.type);
                pickup.remove();
                pickups.splice(index, 1);
                continue;
            }

            if (pickup.isOffScreen()) {
                pickup.remove();
                pickups.splice(index, 1);
            }
        }
        
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
    
    // Show game over screen
    function showGameOver() {
        gameStage.style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'flex';
        
        // Pausar músicas del juego
        backgroundMusic.pause();
        pauseMusic.pause();
        pausedIndicator.style.display = 'none';
        
        
        // Mostrar puntuación final
        console.log('Game Over! Score value:', score);
        document.getElementById('final-score').textContent = `Score: ${score}`;
    }
});

// Reboot button
document.getElementById('reboot-button').addEventListener('click', () => {
    location.reload(); // Reload page to restart
});




