function Slider(domElem, allMeshes, chordsMap) {
	const slider = document.getElementById('slider');
	let timesArray = Array.from(chordsMap.keys()).sort((a, b) => a - b);
	let lowBound = timesArray[0];
	let upBound = timesArray[timesArray.length - 1];

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
			let up = parseInt(value);
		} else {
			let low = parseInt(value);
		}
		
		// allMeshes.meshesById.values().forEach(function(val, key) {
		// 	val.visible = false;
		// });
		
		for(let i=lowBound; i<uppBound; i++) {
			if(chordsMap.has(i)) {
				let length = chordsMap.get(i).length;
				//console.log(chordsMap.get(i));
				if(length === 1) {
					showOnePoint(chordsMap.get(i)[0]);
				} else if(length === 2) {
					showTwoPoints(chordsMap.get(i));
	
				} else if(length === 3) {
					showThreePoints(chordsMap.get(i));
				} else {
					showPolyhedron(chordsMap.get(i));
				}
			}
		}
	});


	
}