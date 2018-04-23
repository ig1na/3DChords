function parseMidi() {
	var inputElem = document.querySelector('#file-input');
	var file = inputElem.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		var binary = new Uint8Array(e.target.result);
		for(var i in binary) {
			console.log(binary[i].toString(16));
		}
	} 

	reader.readAsArrayBuffer(file); 
}