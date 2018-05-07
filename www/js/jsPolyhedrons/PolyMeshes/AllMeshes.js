function AllMeshes(givenScale) {
	this.meshById = new Map();
	this.labels = new THREE.Group();
	this.meshGroup = new THREE.Group();

	let scale = givenScale;

	function fromPtsNumber(number) {
		const gen = subsets(allPoints, number);
		
		for(let subset of gen) {
			let subArray = Array.from(subset);
			let sorted = subArray.sort((a, b) => allPoints.indexOf(a) - allPoints.indexOf(b));
			let key = keyFromPtArray(sorted, allPoints);

			try {
				let mesh = new MeshFromPtsArray(subArray, scale);
				mesh.visible = false;

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

	

	console.log('meshById: ', this.meshById);

		//creates all point meshes
	/*allPoints.forEach((point, i) => {
		let sphere = new OnePoint(point, scale);
		sphere.visible = false;
		spheres.set(i,sphere);

		scene.add(sphere);
	});

	const stickGen = subsets(allPoints, 2);
	let stickPts;
	while(!(stickPts = stickGen.next()).done) {
		let stickPtsArray = Array.from(stickPts.value);
		let p1 = stickPtsArray[0];
		let p2 = stickPtsArray[1];
		
		let stick = new TwoPoints(p1, p2, scale);
		stick.visible = false;
		
		sticks.set(keyFromPtSet(stickPtsArray, allPoints), stick);

		scene.add(stick);
	}

	const faceGen = subsets(allPoints, 3);
	let facePts;
	while(!(facePts = faceGen.next()).done) {
        let facePtsArray = Array.	from(facePts.value);

        let face = new ThreePoints(facePtsArray, scale);
        face.visible = false;
        
		faces.set(keyFromPtSet(facePtsArray, allPoints), face);

		scene.add(face);
	}*/
}

AllMeshes.prototype.showFromPtsArray = function(ptsArray, value) {
	let maxIter = ptsArray.length % 4;
	//console.log('ptsArray', ptsArray);
	for(let i=1; i<=maxIter; i++){
		let gen = subsets(ptsArray, i);
		for(let sub of gen) {
			let subArray = Array.from(sub);
			
			let key = keyFromPtArray(subArray);

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

function keyFromPtArray(array, indexer) {
	let key = '';
	let index;
	let sorted;
	let isIndexed = (indexer != null);

	if(isIndexed) {
		sorted = array.sort((a, b) => indexer.indexOf(a) - indexer.indexOf(b));
	} else {
		sorted = array.sort((a, b) => a - b);
	}

	for(let point of sorted) {
		if(isIndexed)
			index = indexer.indexOf(point);
		else
			index = point;

		key += '.'+String(index);
	}

	return key;
}