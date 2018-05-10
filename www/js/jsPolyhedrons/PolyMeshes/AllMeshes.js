// Creates all meshes and hides them to show them when needed. This will create a group of meshes containing all spheres,
// all cylinders and all triangular faces
function AllMeshes(givenScale) {
	this.meshById = new Map();
	this.labels = new THREE.Group();
	this.meshGroup = new THREE.Group();

	let scale = givenScale;

	// this internal function will create all possible meshes from the number of points it is made of, using the allPoints array
	// as a reference for positionning and creating those meshes
	// for example, if we want meshes with only one point, it will creates a sphere for each point in allPoints array
	function fromPtsNumber(number) {
		const gen = subsets(allPoints, number);					// creates a generator for every subset of size 'number' of allPoints array
		
		for(let subset of gen) {								// iterate through the generator
			let subArray = Array.from(subset); 					// creates an array from the iterator
			let key = KeyFromPtsArray(subArray, allPoints);		// creates a unique key based on the notes in the array

			try {
				let mesh = new MeshFromPtsArray(subArray, scale);
				mesh.visible = false;							// hides the mesh 

				this.meshById.set(key, mesh);

				this.meshGroup.add(mesh);
			} catch(err) {
				console.log(err);
			}
		}
	}

	fromPtsNumber.call(this,1);
	fromPtsNumber.call(this,2);
	fromPtsNumber.call(this,3);
}

// This function will show the meshes that match the given array of notes
AllMeshes.prototype.showFromPtsArray = function(ptsArray, value) {
	let maxIter = ptsArray.length % 4;

	for(let i=1; i<=maxIter; i++){
		let gen = subsets(ptsArray, i);

		for(let sub of gen) {
			let subArray = Array.from(sub),
				key = keyFromPtArray(subArray);

			if(this.meshById.has(key)) {
				this.meshById.get(key).visible = value;	
			}
		}
	}
}

AllMeshes.prototype.showFromKey = function(key, value) {
	if(this.meshById.has(key))
		this.meshById.get(key).visible = value;
}