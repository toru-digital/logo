import {settings} from './_settings.js';

export const getRowsAndCols = () => {
	const container_width = document.getElementById("logo-container").getElementsByTagName("svg")[0].clientWidth
	const container_height = document.getElementById("logo-container").getElementsByTagName("svg")[0].clientHeight

	return {
		num_cols: Math.ceil (container_width / (settings.size + settings.padding)),
		num_rows: Math.ceil (container_height / (settings.size + settings.padding))
	}
} 