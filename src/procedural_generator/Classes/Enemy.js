export default class Enemy {
    constructor(x, y, enemy) {
        this.x = x;
        this.y = y;
        this.enemy = enemy;
        this.playerSeen = false;
        this.damageCooldown = 200;
        this.lastDamageTime = 0;
    }

    update(dt) {
        // Update enemy position
        this.enemy.position.set(this.x, this.y, -6);

        // Calculate distance between player and enemy
        let distance = Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2);

        // Check for sight collision
        if (distance < 20 && !this.playerSeen) {
            // Handle collision
                console.log('Player seen!');
                this.playerSeen = true;
        }

        // Check for damage collision
        const currentTime = Date.now();
        if (distance < 5 && currentTime - this.lastDamageTime > this.damageCooldown) {
            // Handle collision
            this.lastDamageTime = currentTime;
            player.life -= 2;
            if (player.life <= 0) {
                player.life = 0;
                document.getElementById('life').innerText = `Life: ${player.life}`;
                window.alert('Game Over!');
            }
        }

        //Move enemy towards player
        if (this.playerSeen) {
            const speed = 0.1; // Adjust the speed here
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            this.x += normalizedDx * speed;
            this.y += normalizedDy * speed;
        }
    }
}