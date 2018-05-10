// Creates an object with two accessible maps, one containing chords by event time, the other containing keys by event time
// keys are made of the concatenation of notes values modulo 12
// this object has a function that parses midi files and fill the two maps
function MidiToChordMap() {
	this.chordsMap = new Map();
	this.keysMap = new Map();
}

// This prototype function will parse a midi file using midi-parser-js library, and then fill the two maps of this object
// chords are saved for each event time, and keys too.
MidiToChordMap.prototype.parse = function(domFileInput, callback) {
	const file = domFileInput.files[0];
	let reader = new FileReader();
	let thisObj = this;

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

				if(prevTime != eventTime && currNotes.length != 0) {
					let notesArray = Array.from(new Set(currNotes));
					let keys = [];

					for(let i=1; i<=3; i++) {
						let gen = subsets(notesArray, i);
						for(let sub of gen) {
							let subArray = Array.from(sub);
							let key = KeyFromPtsArray(subArray);
							
							keys.push(key);
						}
					}
					//let sorted = notesArray.sort((a, b) => a - b);

					thisObj.chordsMap.set(eventTime, notesArray);
					
					thisObj.keysMap.set(eventTime, keys);
				}
				if(type === 8 || (type === 9 && velocity === 0)) {
					currNotes.splice(currNotes.indexOf(note), 1);

				} else if(type === 9 && velocity > 0) {
					currNotes.push(note);
				} 
			}
			prevTime = eventTime;
		});

		callback();
	} 

	reader.readAsArrayBuffer(file); 
}