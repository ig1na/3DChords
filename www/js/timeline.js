function Slider(domElem, allMeshes, chordsMap) {
	const slider = document.getElementById('slider');
	let timesArray = Array.from(chordsMap.keys()).sort((a, b) => a - b);
	let lowBound = timesArray[0];
	let upBound = timesArray[timesArray.length - 1];
	let up = upBound;
	let low = lowBound;

	if(slider.noUiSlider != null)
		slider.noUiSlider.destroy();

	noUiSlider.create(slider, {
		start: [ 0, 500 ],
		connect: true,
		tooltips: [ true, true ],
		range: {
			'min': lowBound,
			'max': upBound
		},
		format: wNumb({
			decimals: 0
		})
	});

	slider.noUiSlider.on('update', function(values, handle) {
		let value = values[handle];
		if(handle === 1) {
			up = parseInt(value);
		} else {
			low = parseInt(value);
		}
		
		// allMeshes.meshesById.values().forEach(function(val, key) {
		// 	val.visible = false;
		// });
		
		for(let i=lowBound; i<upBound; i++) {
			if(i>=low && i<=up) {
				if(chordsMap.has(i)) {				
					allMeshes.showFromPtsArray(chordsMap.get(i), true);
				}
			} else {
				if(chordsMap.has(i)) {				
					allMeshes.showFromPtsArray(chordsMap.get(i), false);
				}
			}
			
		}
	});


	
}