function parseMidi() {
	var inputElem = document.querySelector('#file-input');
	var file = inputElem.files[0];
	var reader = new FileReader();
	var chordsMap = {};

	reader.onload = function(e) {
		var uint8array = new Uint8Array(e.target.result);
		var parsed = MIDIParser.Uint8(uint8array);

		for(track of parsed.track) {

			var deltaTime = 0;
			for(event of track.event) {

				deltaTime += event.deltaTime;

				if(event.type === 9) {

					if(deltaTime in chordsMap) {
						chordsMap[deltaTime].push(event.data[0]);
					} else {
						chordsMap[deltaTime] = [event.data[0]];
					}

				} 
			}
		}

		console.log(chordsMap);
		let prev;
		for(var time in chordsMap) {
			let newChord = new Chord(chordsMap[time]);
			if(prev == null || !prev.equals(newChord))
				chords[time] = newChord;
			
			prev = newChord;
		}


		var keys = Object.keys(chords);
		createSlider(parseInt(keys[0]), parseInt(keys[keys.length-1]));
		console.log(chords);
		//drawChords(lowBound, upBound);
		
	} 

	reader.readAsArrayBuffer(file); 
}