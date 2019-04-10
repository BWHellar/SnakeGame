// This will get both the canvas we are working on and give us the ability to work within the canvas.
const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// This will create the unit of the box for each portion of the snake. Everytime the Snake eats something a box will be added onto him.
const box = 32;

// This will create a new image for the background or the ground in this case.
const ground = new Image();
ground.src = "img/ground.png";
// This will create a new image for the food that the snake is trying to get.
const foodImg = new Image();
foodImg.src = "img/food.png";

// This will give audio files to variables in order to use them on command.
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();
// This is the links for the audio files that we will be using for each action noted below.
dead.src = "img/dead.mp3";
eat.src = "img/eat.mp3";
up.src = "img/up.mp3";
right.src = "img/right.mp3";
left.src = "img/left.mp3";
down.src = "img/down.mp3";

// This will allow us to create the snake.
let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// This will allow us to create random instances of the food that we need to obtain. The 17 is how many boxes we have across and the 15 is how many boxes we have from the top that we are allowing food to spawn in.
let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// This sets the score at 0
let score = 0;

// This will be our control scheme for the snake.  It is important to note that every key on the keyboard has a code attached to it.  37 = A, 38 = W, 39 = D, 40 = S.  We want to make the EventListener Keydown in order to operate on a keypress. We want any other function to have access to d;
let d;
document.addEventListener("keydown",direction);
function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// This will check our collision function. What this is saying is that it is going to constantly run a for loop and check if the head x and y is the same as our array x and y. 
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// We want to draw everything.
function draw(){
    // This first part allows us to draw the Snake itself.  It runs a for loop over itself to add to itself.  The fill style will designate what gets added to the Snake.
    ctx.drawImage(ground,0,0);
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    ctx.drawImage(foodImg, food.x, food.y);

    // This is the old snake head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // This is the direction of the snake
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // What happens if the snake eats the food. Having the snake x and y == to the food x and y allows it to eat the food when they are in the same location.
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // So the tail is not removed when the Snake eats something.
    }else{
        // Removes the tail.  This and the newHead below is interesting in that it seems like the Snake is moving by popping of the tail and adding a new head instead of dynamically adding a head to the snake as it moves.  It is counting on pre existing parts.
        snake.pop();
    }
    // Adds a new head
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // Game over

    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
    }

    snake.unshift(newHead);
    //  This will literally draw the score on the upper left hand portion of canvas.
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// This calls the draw function every 150 ms
let game = setInterval(draw,150);
