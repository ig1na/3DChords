function Slider(domElem, allMeshes, chordsMap) {
	const slider = document.getElementById('slider');
	let timesArray = Array.from(chordsMap.keys()).sort((a, b) => a - b);
	let lowBound = timesArray[0];
	let upBound = timesArray[timesArray.length - 1];
	let up = upBound;
	let low = lowBound;

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

	console.log(chordsMap);

	slider.noUiSlider.on('update', function(values, handle) {
		let value = values[handle];
		if(handle === 1) {
			up = parseInt(value);
		} else {
			low = parseInt(value);
		}

		for(let mesh of allMeshes.meshById.values()) {
			mesh.visible = false;
		}
		
		for(let i=low; i<up; i++) {
			if(chordsMap.has(i)) {
				//allMeshes.showFromPtsArray(chordsMap.get(i), true);
				let keys = chordsMap.get(i);
				for(let key of keys) {
					allMeshes.showFromKey(key, true);
				}
				
			}
		}

		// for(let mesh of allMeshes.meshById.values()){
		// 	mesh.visible = true;
		// }
	});


	
}