import {settings} from './_settings.js';

const hypot = Math.hypot || function(x, y){ return Math.sqrt(x*x + y*y) }

export const getRowsAndCols = () => {
	const container_width = document.getElementById("logo-container").getElementsByTagName("svg")[0].clientWidth
	const container_height = document.getElementById("logo-container").getElementsByTagName("svg")[0].clientHeight

	return {
		num_cols: Math.ceil (container_width / (settings.size + settings.padding)),
		num_rows: Math.ceil (container_height / (settings.size + settings.padding)),
		hypot: hypot(container_width, container_height)
	}
} 

export const isMobile = {
	Android: () =>navigator.userAgent.match(/Android/i),
	BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
	iOS: () =>  navigator.userAgent.match(/iPhone|iPad|iPod/i),
	Opera: () => navigator.userAgent.match(/Opera Mini/i),
	Windows: () => navigator.userAgent.match(/IEMobile/i),
	any: () => (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
};

export const randomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
}


// if ( isMobile.any() ) {
// 	document.addEventListener('touchstart', handleTouchStart);
// 	document.addEventListener('touchmove', handleTouchMove);

// 	let x1 = null;
// 	let y1 = null;

// 	function handleTouchStart(event) {
// 		const firstTouch = event.touches[0];
// 		x1 = firstTouch.clientX;
// 		y1 = firstTouch.clientY;
// 		e.preventDefault ()
// 	}

// 	function handleTouchMove(event) {
// 		if ( !x1 || !y1 ) return false; // check swipe
// 		let x2 = event.touches[0].clientX;
// 		let y2 = event.touches[0].clientY;

// 		let xDiff = x2 - x1;
// 		let yDiff = y2 - y1;

// 		if ( Math.abs(xDiff) > Math.abs(yDiff) ) {
// 			xDiff > 0 ? turnRight() : turnLeft();
// 		} else {
// 			yDiff < 0 ? turnUp() : turnDown();
// 		}

// 		x1 = null;
// 		y1 = null;
// 		e.preventDefault ()
// 	}
// }