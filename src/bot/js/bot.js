const io = require('socket.io-client');

// Connect to the local server
const socket = io('http://agar:3000', { query: "type=player" });

const botConfig = {
    name: 'Robot_' + Math.floor(Math.random() * 999),
    screenWidth: 1920,
    screenHeight: 1080,
    target: { x: 0, y: 0 }
};

const gameState = {
    player: { x: 0, y: 0, massTotal: 0, cells: [] },
    users: [],       
    foods: [],       
    fireFood: [],    
    viruses: [],     
    leaderboard: []  
};

socket.on('serverTellPlayerMove', (playerData, userData, foodsList, massList, virusList) => {
    // Update the bot's own stats
    gameState.player.x = playerData.x;
    gameState.player.y = playerData.y;
    gameState.player.massTotal = playerData.massTotal;
    gameState.player.cells = playerData.cells;
    
    // Update the environment around the bot
    gameState.users = userData;
    gameState.foods = foodsList;
    gameState.fireFood = massList;
    gameState.viruses = virusList;
});

// Capture the leaderboard updates
socket.on('leaderboard', (data) => {
    gameState.leaderboard = data.leaderboard;
});

// Capture game events (Optional: useful for logging or tracking specific enemies)
socket.on('playerDied', (data) => {
    console.log(`${data.playerEatenName} was eaten!`);
});

socket.on('serverSendPlayerChat', (data) => {
    console.log(`[CHAT] ${data.sender}: ${data.message}`);
});

// 1. Connection established
socket.on('connect', () => {
    console.log(`Bot connected directly!`);
    socket.emit('respawn');
});

// 2. Game welcomes the player
socket.on('welcome', (playerSettings, gameSizes) => {
    console.log(`Received welcome. Joining game as ${botConfig.name}...`);
    
    // Extend the settings sent by the server with the bot's details
    const player = { ...playerSettings, ...botConfig };
    
    // Tell the server we are ready
    socket.emit('gotit', player);
});

// 3. Move the bot randomly
setInterval(() => {
    if (socket.connected) {
        if (gameState.foods.length > 0) {
            const nearestFood = findNearestFood();
            if (nearestFood) {
                botConfig.target.x = nearestFood.x - gameState.player.x;
                botConfig.target.y = nearestFood.y - gameState.player.y;
            }
        } else {
            // If no food, move randomly
            botConfig.target.x = (Math.random() - 0.5) * botConfig.screenWidth;
            botConfig.target.y = (Math.random() - 0.5) * botConfig.screenHeight;
        }
        socket.emit('0', botConfig.target); 
    }
}, 100); // 100ms matches the heartbeat of a typical client

// 4. Handle dying / eaten
socket.on('RIP', () => {
    console.log('Bot was eaten! Respawning...');
    // Emit 'respawn' to come back to life immediately
    socket.emit('respawn'); 
});

// Other useful events
socket.on('disconnect', () => {
    console.log('Bot disconnected from server.');
});

socket.on('kick', (reason) => {
    console.log('Bot was kicked:', reason);
});

function findNearestFood() {
    if (gameState.foods.length === 0) return null;
    
    let nearest = gameState.foods[0];
    let minDistanceSquared = Infinity;

    const px = gameState.player.x;
    const py = gameState.player.y;

    for (let i = 0; i < gameState.foods.length; i++) {
        const food = gameState.foods[i];
        
        // Calculate the difference in coordinates
        const dx = food.x - px;
        const dy = food.y - py;
        
        // Use squared distance (dx^2 + dy^2). Skips the expensive square root.
        const distSquared = (dx * dx) + (dy * dy);
        
        if (distSquared < minDistanceSquared) {
            minDistanceSquared = distSquared;
            nearest = food;
        }
    }

    return nearest;
}