export default class Enemy {
    constructor(x, y, enemy, player) {
        this.x = x;
        this.y = y;
        this.enemy = enemy;
        this.playerSeen = false;
        this.damageCooldown = 200;
        this.lastDamageTime = 0;
        this.player = player;
        this.life = 100; // Add life property to the enemy
        this.dead = false;
    }

    update(dt) {
        // Update enemy position
        this.enemy.position.set(this.x, this.y, 2);

        // Calculate distance between player and enemy
        let distance = Math.sqrt((this.player.x - this.x) ** 2 + (this.player.y - this.y) ** 2);

        // Check for sight collision
        if (distance < 15 && !this.playerSeen) {
            // Handle collision
            console.log('Player seen!');
            this.playerSeen = true;
        }

        // Check for damage collision from enemy to player
        const currentTime = Date.now();
        if (distance < 1 && currentTime - this.lastDamageTime > this.damageCooldown && !this.dead) {
            // Handle collision
            this.lastDamageTime = currentTime;
            this.player.life -= 0.5;
            console.log('Player takes damage!');
            if (this.player.life <= 0) {
                this.player.life = 0;
                document.getElementById('life').innerText = `Life: ${this.player.life}`;
                window.alert('Game Over!');
            }
        }

        // Check for damage collision from player to enemy
        if (distance < 1 && this.player.isAttacking) {
            this.life -= 0.5; // Adjust the damage value as needed
            console.log('Enemy takes damage!', this.life);
            if (this.life <= 0) {
                console.log('Enemy defeated!');
                // Handle enemy defeat (e.g., remove enemy from scene)
                this.enemy.mesh.visible = false;
                this.dead = true;
            }
        }

        // Move enemy towards player
        if (this.playerSeen && distance > 1) {
            const speed = 0.025; // Adjust the speed here
            const dx = this.player.x - this.x;
            const dy = this.player.y - this.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            this.x += normalizedDx * speed;
            this.y += normalizedDy * speed;
        }
    }
}
