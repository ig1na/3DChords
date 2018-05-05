function MidiToChordMap() {
	let reader = new FileReader();
	this.chordsMap = new Map();
}

MidiToChordMap.prototype.parse = function(domFileInput) {
	const file = domFileInput.files[0];

	reader.onload = function(e) {
		let uint8array = new Uint8Array(e.target.result);
		// let hexArray = [];
		// uint8array.forEach(element => {
		// 	hexArray.push(ConvertBase.dec2hex(element));
		// });
		// console.log('hexArray', hexArray);
		let parsed = MIDIParser.parse(uint8array),
			oneTrack = [],
			sortedOneTrk = [],
			currNotes = [],
			prevTime = -1,
			eventTime = -1;

		parsed.track.forEach(track => {
			let currDeltaTime = 0;

			track.event.forEach(event => {
				currDeltaTime += event.deltaTime;

				oneTrack.push({ 'event': event, 'time': currDeltaTime});
			});
		});

		//console.log(oneTrack.sort((a,b) => a.time - b.time).sort((a,b) => a.event.type - b.event.type));
		sortedOneTrk = oneTrack.sort((a,b) => (a.time + a.event.type) - (b.time + b.event.type));	
		sortedOneTrk.forEach(oneTrEvent => {
			let ev = oneTrEvent.event;
			let type = ev.type;

			if(type === 9 || type === 8) {
				let note = ev.data[0] % 12;
				let velocity = ev.data[1];
				eventTime = oneTrEvent.time;

				if(prevTime === -1)
					prevTime = eventTime;

				if(prevTime != eventTime && currNotes.length != 0)
					this.chordsMap.set(eventTime, Array.from(new Set(currNotes)));

				if(type === 8 || (type === 9 && velocity === 0)) {
					currNotes.splice(currNotes.indexOf(note), 1);

				} else if(type === 9 && velocity > 0) {
					currNotes.push(note);
				} 
			}
			prevTime = eventTime;
		});

		var keys = Array.from(chordsMap.keys()).sort((a, b) => a - b);
		//console.log(keys);
		createSlider(keys[0], keys[keys.length-1]);
	} 

	reader.readAsArrayBuffer(file); 
}