let chordsMap = new Map();

function parseMidi() {
	const inputElem = document.querySelector('#file-input');
	let file = inputElem.files[0];
	let reader = new FileReader();


	reader.onload = function(e) {
		let uint8array = new Uint8Array(e.target.result);
		let parsed = MIDIParser.Uint8(uint8array);

		for(track of parsed.track) {

			let deltaTime = 0;
			let note;
		
			for(event of track.event) {
				deltaTime += event.deltaTime;
				
				if(event.type === 9) {

					note = event.data[0] % 12;

					if(chordsMap.has(deltaTime)) {
						chordsMap.get(deltaTime).push(note);
					} else {
						chordsMap.set(deltaTime, [note]);
					}
				} 
			}
		}

		//test

		console.log(chordsMap);

		// let addedChordsMap = {};

		// Object.defineProperty(addedChordsMap, 'hasValueArray', {
		// 	enumerable: false,
		// 	value: function(array) {
		// 		const keys = Object.keys(this);
		// 		const values = Object.values(this);

		// 		for(let key of keys) {
		// 			if(JSON.stringify(this[key].sort()) === JSON.stringify(array.sort())) {
		// 				//console.log(JSON.stringify(this[key].sort()) + '   ' + JSON.stringify(array.sort()));
		// 				return key;
		// 			}
		// 		}
			
		// 		return -1;
		// 	}
		// });

		// let prev;
		// let existingChordKey;
		// let nbChords = 0;
		// let nbSameChords = 0;

		// //for every event time in the song
		// for(var time in chordsMap) {
		// 	nbChords++;

		// 	//if the chord has already been added for another time, don't create a new chord mesh
		// 	//if((existingChordKey = addedChordsMap.hasValueArray(chordsMap[time])) != -1) {
		// 		//console.log(existingChordKey);
		// 		chords[time] = chords[existingChordKey];
		// 		nbSameChords++;
		// 	//} else {
		// 		let newChord = new Chord(chordsMap[time]);
		// 		//if(prev == null || !prev.equals(newChord))
		// 		chords[time] = newChord;
		// 		//addedChordsMap[time] = chordsMap[time];
				
		// 		//prev = newChord;
		// 	}
			
		// }

		// console.log('nbChords : '+nbChords);
		// console.log('nbSameChords : '+nbSameChords);


		var keys = Array.from(chordsMap.keys()).sort((a, b) => a - b);
		createSlider(keys[0], keys[keys.length-1]);
		//drawChords(lowBound, upBound);
		
	} 

	reader.readAsArrayBuffer(file); 
}