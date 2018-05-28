function Slider(domElem, allMeshes, chordsMap) {
	const slider = document.getElementById('slider');
	let timesArray = Array.from(chordsMap.keys());
	console.log("timesArray", timesArray);
	let lowBound = timesArray[0][0];
	let upBound = timesArray[timesArray.length - 1][1];
	let up = upBound;
	let low = lowBound;
	let lastKeys;

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
		let value = parseInt(values[handle]);

		for(let mesh of allMeshes.meshById.values()) {
			mesh.visible = false;
		}

		if(handle === 1) {
			up = value;
		} else {
			low = value;
		}

		for(let i=0; i<timesArray.length; i++) {
			let bounds = timesArray[i];
			if((bounds[1] >= low && bounds[1] <= up) || (bounds[0] >= low && bounds[0] <= up) || (bounds[0] <= low && bounds[1] >= up) || (bounds[0] >= low && bounds[1] <= up)) {
				let values = chordsMap.get(bounds);
				for(let val of values) {
					allMeshes.showFromKey(val, true);
				}
				
			}
		}
		

		/*for(let i=low; i<=up; i++) {
			if(chordsMap.has(i)){
				let keys = chordsMap.get(i);
				for(let key of keys) {
					allMeshes.showFromKey(key, true);
				}

				if(lastKeys === -1) {
					lastKeys = chordsMap.get(i);
				}
			}
		}*/

	});


	
}