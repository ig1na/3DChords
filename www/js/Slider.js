function Slider(domElem, allMeshes, chordsMap) {
	const slider = document.getElementById('slider');
	let timesArray = Array.from(chordsMap.keys()).sort((a, b) => a - b);
	let lowBound = timesArray[0];
	let upBound = timesArray[timesArray.length - 1];
	let up = upBound;
	let low = lowBound;
	let keysUp, keysLow;

	console.log('chordsMap', chordsMap);
	console.log('upBound', upBound);
	console.log('lowBound', lowBound);

	if(slider.noUiSlider != null)
		slider.noUiSlider.destroy();

	noUiSlider.create(slider, {
		start: [ 0, 500 ],
		connect: true,
		step: 1,
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

		for(let mesh of allMeshes.meshById.values()) {
			mesh.visible = false;
		}

		if(handle === 1) {
			up = parseInt(value);
			if(chordsMap.has(up)) 
				keysUp = chordsMap.get(up);

		} else {
			low = parseInt(value);
			if(chordsMap.has(low))
				keysLow = chordsMap.get(low);
		}

		if(keysUp != undefined) {
			for(let keyUp of keysUp) {
				allMeshes.showFromKey(keyUp, true);
			}
		}

		if(keysLow != undefined) {
			for(let keyLow of keysLow) {
				allMeshes.showFromKey(keyLow, true);
			}
		}

		for(let i=low; i<up; i++) {
			if(chordsMap.has(i)) {
				let keys = chordsMap.get(i);
				for(let key of keys) {
					allMeshes.showFromKey(key, true);
				}
			}
		}
	});


	
}