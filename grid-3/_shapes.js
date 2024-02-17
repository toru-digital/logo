import {settings} from './_settings.js';

export const drawT = draw => {
	const s1 = settings.size;
	const s2 = settings.size * 0.2 * settings.growth;
	const s3 = s1 - s2;

	draw.defs().group ().addClass('letter-0')
		.path(`M ${s2}  0 L ${s3} 0 L ${s3} ${s2} L ${s1} ${s2} L ${s1} ${s3} L ${s3} ${s3} L ${s3} ${s1} L ${s2} ${s1} L ${s2} ${s3} L 0 ${s3} L 0 ${s2} L ${s2} ${s2} L ${s2} 0`)
		
}

export const drawO = draw => {
	return draw.defs().group ().addClass('letter-1')
		.rect(settings.size, settings.size)
		.radius(settings.size * 0.5 * settings.growth, settings.size * 0.5 * settings.growth)
}

export const drawR = draw => {
	draw.defs().group ().addClass('letter-2')
		.rect(settings.size, settings.size)
}

export const drawU = draw => {
	const s1 = settings.size
	const s2 = s1 / 3
	const s3 = s1 - s2
	const s4 = s1 * 0.15 * settings.growth
	const s5 = s1 - s4

	draw.defs ().group ().addClass('letter-3')
		.path(`
		M 0 0 
		H ${s1} 
		V ${s3} 
		C ${s1} ${s5} ${s5} ${s1} ${s3} ${s1} 
		H ${s2} 
		C ${s4} ${s1} 0 ${s5} 0 ${s3}`
	)
}