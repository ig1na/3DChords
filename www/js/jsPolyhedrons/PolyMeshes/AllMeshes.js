function AllMeshes(givenScale) {
	this.meshById = new Map();
	this.labels = new THREE.Group();
	this.meshGroup = new THREE.Group();

	let scale = givenScale;

	function fromPtsNumber(number) {
		const gen = subsets(allPoints, number);
		
		for(let subset of gen) {
			let subArray = Array.from(subset);

			try {
				let mesh = new MeshFromPtsArray(subArray, scale);
				mesh.visible = true;

				this.meshById.set(keyFromPtArray(subArray, allPoints), mesh);

				this.meshGroup.add(mesh);
			} catch(err) {
				console.log(err);
			}
		}
	}

	fromPtsNumber.call(this,1);
	fromPtsNumber.call(this,2);
	fromPtsNumber.call(this,3);

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
	for(let i=1; i<=3; i++){
		let gen = subsets(ptsArray, i);
		for(let sub of gen) {
			let array = Array.from(sub);
			//console.log(array);
			let key = keyFromPtArray(array);
			
			if(this.meshById.has(key))
				this.meshById.get(key).visible = value;
		}
		
	
	}
	//console.log(this.meshById);
	
}

function keyFromPtArray(array, indexer) {
    let sorted = array.sort((a, b) => a - b);

	if(indexer != null){
		return array.reduce((acc, v) => acc + 1 << indexer.indexOf(v), 0);
	} else {
		return array.reduce((acc, v) => acc + 1 << v, 0);
	}
}