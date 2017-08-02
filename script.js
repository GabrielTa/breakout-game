/*selects and returns mycanvasid*/
var canvas  = document.getElementById("myCanvas");
/*returns a drawing context on the canvas*/
var ctx 	= canvas.getContext("2d"); 
	

/*centers the ball*/	
var x 				= canvas.width/2;
/*vertical position*/
var y 				= canvas.height - 30;
/*value text making the ball nmove*/
var dx 				= 2;
var dy 				= -2;
/*ballRadius used for collision detection*/
var ballRadius 		= 10;
/*paddle variables*/
var paddleHeight 	= 10;
var paddleWidth 	= 75;
var paddleX 		= (canvas.width-paddleWidth)/2;
/*keyaboard controls for the paddle*/
var rightPressed 	= false;
var leftPressed 	= false;

/*Var for bricks*/
var brickRowCount    = 3;
var brickColumnCount = 5;
var brickWidth       = 75;
var brickHeight      = 20;
var brickPadding     = 10;
var brickOffsetTop   = 30;
var brickOffsetLeft  = 30;
var lives 			 = 3;
var score 			 = 0;

var bricks = [];
for (c=0; c<brickColumnCount; c++){
	bricks[c] = [];
	for (r=0; r<brickRowCount; r++){
		bricks[c][r] = {x:0, y:0, status:1}
	}
}

/*event listeners for key presses*/
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

//paddle movement logic
/*both functions take an even as a parameter*/
function keyDownHandler(e) {
	if (e.keyCode  == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}	

function keyUpHandler(e) {
	if (e.keyCode  == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}	

/*draw bricks function*/
function drawBricks() {
	for (c=0; c<brickColumnCount; c++) {
		for (r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status ==1) {

				var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle ="#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function collisionDetection() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if(b.status == 1){
				if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y +  brickHeight){
					dy = -dy;
					b.status=0;
					score++;
					if(score == brickRowCount*brickColumnCount) {
						alert("You Won! Congradulations!");
						document.location.reload();
					}
				}	
			}
		}
	}
}



/*drawball function, later invoking in draw*/
function drawBall() {
	ctx.beginPath();
	/*arc=circle; x = position-width; y = position-height; ballRadius = circle size; 0 -start angle; Math.PI*2 = end angle */
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	/*stores circle color*/
	ctx.fillStyle= "#0095DD"
	/*fills the color*/
	ctx.fill();
	ctx.closePath();
}

/*draw paddle function, later invoking in draw*/
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawScore () {
	ctx.font = "16px Arial";
	ctx.fillStyle  = "#0095DD";
	ctx.fillText("Score" + score, 8, 20);
}

function drawLives()  {
	ctx.font = "16px Arial";
	ctx.fillStyle  = "#0095DD";
	ctx.fillText("Lives:" + lives, canvas.width - 65, 20)
}


function draw() {
	/*Method clearing the canvas; top left = 0,0; bottom right = canvas.width, canvas.height; */
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	collisionDetection();
	drawScore();
	drawLives();
	
	

	/*collision detection for the ball on the y axis*/

	/*if the ball is touching the top of the canvas - direction is changed*/
	if (y + dy < ballRadius) {
		dy = -dy;
	/*if the ball is touching the bottomm of the canvas*/
	}else if (y + dy> canvas.height-ballRadius) {
		/*if the ball is between left or right edges of the paddle it will bounce back*/
		if(x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		}else {
		 	lives --;
		 	if(!lives) {
				alert("GAME OVER")
				document.location.reload();
			} else {
				x=canvas.width/2;
				y=canvas.height-30;
				dx= 2;
				dy= -2;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
 	}	

	/*collision detection for the ball on the x axis*/

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	/*paddle movement*/
	if(rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -=7;
	}


	/*draws the ball in a slightly different position*/
	/*x = width*/
	x += dx;
	/*y = height*/
	y += dy;
	requestAnimationFrame(draw)
}


/*mouse controls */
document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 + paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
		paddleX = relativeX - paddleWidth/2
	}
}

/*interval function takes two parameters. first parameter is a function to be executed;  10 = miliseconds*/
draw();