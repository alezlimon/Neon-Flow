# Neon Flow Game Blueprint

## Core Fantasy

Neon Flow should evolve from a simple arcade prototype into a responsive cyberpunk survival shooter where the player starts as a fragile rebel and gradually becomes a dangerous network weapon. The key fantasy is not just surviving waves, but feeling the system reshape around the player as power increases.

The tone should stay arcade, neon, and slightly tragic: the more power you absorb, the closer you get to losing your identity.

## Pillars

1. Responsive arcade action on laptop and phone.
2. Clear power growth through auto-fire weapon evolution.
3. Tactical survival through health, shields, healing, and shockwave charges.
4. Narrative progression through sectors, not just endless spawning.
5. Multiple endings based on performance and corruption.

## Immediate Product Direction

The game should stop being a fixed-size toy and become a scalable vertical shooter that works on small laptop screens and mobile viewports.

The player should focus on movement, positioning, and tactical ability use.

Primary fire should become automatic.

The space bar should be reserved for a shockwave ability once that system exists.

## Responsive Plan

### Goal

Keep the vertical arcade feel without cutting off the bottom of the playfield on smaller displays.

### Approach

1. Wrap the game board in a responsive stage container.
2. Preserve a portrait aspect ratio instead of hardcoding raw pixel dimensions into layout.
3. Scale the board based on viewport height and width.
4. Move HUD elements into a dedicated overlay that adapts for mobile.
5. Ensure controls and text remain readable on narrow screens.

### Practical UI Rules

1. The playable area should always fully fit inside the viewport.
2. The HUD must never hide the player or bottom collision area.
3. Start screen and game over screen must scale typography and button size down for phones.
4. Inline styles in HTML should be removed and centralized in CSS.

## Combat Evolution

### Core Combat Change

The player ship should fire automatically at a fixed rate.

The player input focus becomes:

1. Move.
2. Dodge.
3. Time the shockwave.
4. Route toward pickups.

### Weapon Upgrade Path

#### Tier 1: Pulse Needle

Single forward shot.
Fast, narrow, precise.

#### Tier 2: Twin Divergence

Two shots with a mild diagonal spread.
Better lane control while still readable.

#### Tier 3: Core Beam

Continuous central beam.
Strong forward pressure, weaker side control.

#### Tier 4: Halo Beam

Continuous central beam plus two side energy nodes.
The side nodes either deal contact damage or emit light side pulses.

#### Tier 5: Overdrive

Temporary high-power state triggered by pickup or meter.
Beam widens, side nodes intensify, visuals become unstable.

### Upgrade Rules

1. Base weapon tier increases by score thresholds.
2. Optional temporary boosts can push the player into overdrive.
3. Corruption or heavy damage can temporarily reduce efficiency.

## Survival Systems

### Health

Replace instant death with a health bar.

Suggested first pass:

1. Max health: 5 units.
2. Standard obstacle collision: 1 to 2 damage depending on enemy type.
3. Beam and bullet hits: 1 damage.

### Shield

Temporary extra layer that absorbs damage before health.

Suggested rule:

1. One shield pickup gives 2 shield points.
2. Shield should have a strong visible neon shell effect.

### Healing

Rare pickup, not passive regeneration.

Suggested rule:

1. Recover 1 health unit.
2. Do not exceed max health.

### Shockwave

This should become the player’s active panic button and crowd-control tool.

Suggested rule:

1. Activated with space bar.
2. Consumes one charge.
3. Destroys weak enemies and bullets in a radius.
4. Pushes back or damages tougher hazards.

### Shockwave Charges

1. Stored in a small HUD counter.
2. Maximum 3 charges.
3. Gained through pickups or score milestones.

## Pickups

First recommended pickup set:

1. Health fragment.
2. Shield capsule.
3. Shockwave charge.
4. Overdrive shard.

Optional later pickup:

1. Score multiplier.

## Level Structure

The game should move from endless survival toward sectors with identity.

### Sector 1: Neon Slums

Purpose: onboarding.
Focus: simple enemies, simple destructibles, first weapon upgrade.

### Sector 2: Firewall Graveyard

Purpose: pressure and navigation.
Focus: indestructible debris, tighter lanes, more spatial threat.

### Sector 3: Pulse Cathedral

Purpose: projectile mastery.
Focus: enemy fire patterns, timing, shield value.

### Sector 4: Core Breach

Purpose: power at a cost.
Focus: overdrive, corruption pressure, difficult routing.

### Sector 5: The System Heart

Purpose: climax.
Focus: boss encounter or final survival gauntlet with ending resolution.

## Endings

### Bad Ending 1: Corrupted Victory

The player defeats the System but becomes its replacement after overusing unstable power.

### Bad Ending 2: Empty Salvation

The player survives, but too much of the city network collapses along the way.

### Bad Ending 3: Silent Failure

The player reaches the end too weak, too damaged, or too late to restore the flow.

### Good Ending: Clean Reboot

The player restores the network while preserving identity and stabilizing the city.

### Secret Ending: Ghost in the Flow

The player bonds with the system without fully surrendering to it, leaving an ambiguous ending.

## Narrative Delivery

Narrative should stay short and arcade-friendly.

Recommended delivery:

1. Intro screen setup.
2. One short transmission before each sector.
3. One-line warnings when major power shifts happen.
4. Ending screen based on route and performance.

## Production Checklist

- [ ] Make the stage fully responsive for laptop and phone.
- [ ] Remove inline HTML layout styles and move them into CSS.
- [ ] Add a HUD layer with score, health, shield, weapon tier, and shockwave charges.
- [ ] Convert player fire to automatic firing.
- [ ] Reserve space bar for shockwave activation.
- [ ] Implement health instead of pure one-hit death.
- [ ] Add shield and healing pickups.
- [ ] Add shockwave charges and shockwave effect.
- [ ] Implement score-based weapon tier progression.
- [ ] Add Tier 1 through Tier 4 weapons.
- [ ] Add optional overdrive state.
- [ ] Rework enemy spawning into sector-based pacing.
- [ ] Add sector intros and narrative transitions.
- [ ] Add ending conditions and at least 3 bad endings plus 1 good ending.
- [ ] Tune balance after systems are playable together.

## Recommended Execution Order

1. Responsive layout and HUD.
2. Automatic fire and input remapping.
3. Health, shield, healing, and shockwave resources.
4. Weapon tier system.
5. Sector progression and pacing.
6. Endings and narrative polish.

## Creative Guardrails

1. Do not add mechanics unless they reinforce movement, pressure, and escalation.
2. Keep the player fantasy readable at a glance.
3. Each new system must either increase survival choices or deepen the corruption narrative.
4. Avoid turning the game into a cluttered bullet soup before the responsive/HUD pass is solved.