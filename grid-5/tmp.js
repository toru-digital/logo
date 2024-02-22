



const food = { 
	x: randomInt(0, canvas.width / config.sizeCell) * config.sizeCell,
	y: randomInt(0, canvas.height / config.sizeCell) * config.sizeCell,
}

function score() {
	scoreCount++;
	if ( scoreCount > 15 ) config.stepMax = 5;
	else if ( scoreCount <= 15 ) config.stepMax = 6;
}

function gameLoop() {
	requestAnimationFrame (gameLoop);

	if ( ++config.step < config.stepMax ) return;
	config.step = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawFood();
	drawSnake();
}

gameLoop();

function restart() {
	config.stepMax = 6;
	scoreCount = 0;

	snake.x = config.sizeCell;
	snake.y = config.sizeCell;
	snake.body = [];
	snake.maxBodySize = 1;
	snake.dirX = 0;
	snake.dirY = 0;
	dir = '';

	randomPosFood();
}

function drawSnake() {
	snake.x += snake.dirX;
	snake.y += snake.dirY;

	checkBorder();

	snake.body.unshift({x: snake.x, y: snake.y});
	if ( snake.body.length > snake.maxBodySize ) {
		snake.body.pop();
	}

	snake.body.forEach((e, index) => {

		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(e.x, e.y, config.sizeCell, config.sizeCell);

		if ( e.x == food.x && e.y == food.y ) {

			score();
			randomPosFood();
			snake.maxBodySize++;
		}

		for ( let i = index + 1; i < snake.body.length; i++ ) {
			if ( e.x === snake.body[i].x && e.y === snake.body[i].y ) {
				restart();
			}
		}
	});
}

function drawFood () {
	ctx.fillStyle = '#00FF00';
	ctx.fillRect(food.x, food.y, config.sizeCell, config.sizeCell);
}

function turnUp() {
	if ( dir == 'down' ) return
	dir = 'up';
	snake.dirY = -config.sizeCell;
	snake.dirX = 0;
}

const isMobile = {
	Android: () =>navigator.userAgent.match(/Android/i),
	BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
	iOS: () =>  navigator.userAgent.match(/iPhone|iPad|iPod/i),
	Opera: () => navigator.userAgent.match(/Opera Mini/i),
	Windows: () => navigator.userAgent.match(/IEMobile/i),
	any: () => (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
};

if ( isMobile.any() ) {
	document.addEventListener('touchstart', handleTouchStart);
	document.addEventListener('touchmove', handleTouchMove);

	let x1 = null;
	let y1 = null;

	function handleTouchStart(event) {
		const firstTouch = event.touches[0];
		x1 = firstTouch.clientX;
		y1 = firstTouch.clientY;
		e.preventDefault ()
	}

	function handleTouchMove(event) {
		if ( !x1 || !y1 ) return false; // check swipe
		let x2 = event.touches[0].clientX;
		let y2 = event.touches[0].clientY;

		let xDiff = x2 - x1;
		let yDiff = y2 - y1;

		if ( Math.abs(xDiff) > Math.abs(yDiff) ) {
			xDiff > 0 ? turnRight() : turnLeft();
		} else {
			yDiff < 0 ? turnUp() : turnDown();
		}

		x1 = null;
		y1 = null;
		e.preventDefault ()
	}
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function randomPosFood() {
	food.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
	food.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
	drawFood();
}