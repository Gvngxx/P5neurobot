// Variables de Matter.js
let engine, world;
let player, ai;

// Crear una red neuronal con Brain.js
const net = new brain.NeuralNetwork();

// Entrenar la red neuronal con un patrón simple para moverse
net.train([
  { input: [0], output: [1] }, // Mover a la derecha
  { input: [1], output: [0] }  // Mover a la izquierda
]);

// Configuración inicial de P5.js
function setup() {
    // Crear el lienzo y asociarlo al contenedor #game-container
    let canvasElement = createCanvas(windowWidth, windowHeight);
    canvasElement.parent('game-container'); // Coloca el canvas dentro del div con el id 'game-container'

    // Crear el motor y el mundo de Matter.js
    engine = Matter.Engine.create();
    world = engine.world;

    // Crear un jugador (cubo rojo)
    let options = {
        restitution: 0.8, // Elasticidad
        friction: 0.5,     // Fricción
        density: 1.0       // Densidad
    };
   
    player = Matter.Bodies.rectangle(300, height - 50, 50, 100, options); // Posición inicial del jugador (rojo)
    Matter.World.add(world, player);

    // Crear un AI (cubo verde)
    ai = Matter.Bodies.rectangle(500, height - 50, 50, 100, options); // Posición inicial de la IA (verde)
    Matter.World.add(world, ai);

    // Crear un suelo (para ambos cubos)
    let ground = Matter.Bodies.rectangle(width / 2, height, width, 20, { isStatic: true });
    Matter.World.add(world, ground);
}

// Función de actualización
function draw() {
    background(0);

    // Actualizar el motor de física
    Matter.Engine.update(engine);

    // Obtener la posición actual de ambos cubos
    let playerPos = player.position;
    let aiPos = ai.position;

    // Dibujar el jugador (rojo)
    fill(255, 0, 0); // Rojo
    push();
    translate(playerPos.x, playerPos.y);
    rotate(player.angle);
    rectMode(CENTER);
    rect(0, 0, 50, 100); // Dibujar el cubo rojo (jugador)
    pop();

    // Dibujar la IA (verde)
    fill(0, 255, 0); // Verde
    push();
    translate(aiPos.x, aiPos.y);
    rotate(ai.angle);
    rectMode(CENTER);
    rect(0, 0, 50, 100); // Dibujar el cubo verde (IA)
    pop();

    // Controles del jugador
    if (keyIsDown(LEFT_ARROW)) {
        Matter.Body.setVelocity(player, { x: -5, y: player.velocity.y });
    }
    if (keyIsDown(RIGHT_ARROW)) {
        Matter.Body.setVelocity(player, { x: 5, y: player.velocity.y });
    }
    if (keyIsDown(UP_ARROW) && player.velocity.y === 0) {
        Matter.Body.setVelocity(player, { x: player.velocity.x, y: -10 });
    }

    // Usar la red neuronal para decidir el movimiento de la IA
    let output = net.run([aiPos.x / width]);  // Normalizamos la posición en el eje X
    if (output > 0.5) {
        // Mover a la derecha si la red neuronal dice que lo haga
        Matter.Body.setVelocity(ai, { x: 5, y: ai.velocity.y });
    } else {
        // Mover a la izquierda si la red neuronal dice que lo haga
        Matter.Body.setVelocity(ai, { x: -5, y: ai.velocity.y });
    }

    // Condición para que la IA salte si está en el suelo
    if (ai.velocity.y === 0) {
        Matter.Body.setVelocity(ai, { x: ai.velocity.x, y: -10 });
    }
}

// Función que ajusta el tamaño del lienzo cuando la ventana cambia de tamaño
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}