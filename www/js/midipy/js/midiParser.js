function parseMidi() {
	var inputElem = document.querySelector('#file-input');
	var file = inputElem.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		var binary = e.target.result;
		console.log(binary);
	} 

	reader.readAsArrayBuffer(file); 
}