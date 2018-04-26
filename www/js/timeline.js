function createSlider(from, to) {
	const slider = document.getElementById('slider');
	let lowBound = from;
	let upBound = to/10;

	noUiSlider.create(slider, {
		start: [ 0, 500 ],
		connect: true,
		tooltips: [ true, true ],
		range: {
			'min': from,
			'max': to
		},
		format: wNumb({
			decimals: 0
		})
	});

	drawChords(lowBound, upBound);

	slider.noUiSlider.on('update', function(values, handle) {
		var value = values[handle];

		if(handle === 1) {
			upBound = parseInt(value);
		} else {
			lowBound = parseInt(value);
		}
		
		drawChords(lowBound, upBound);
	});


	
}