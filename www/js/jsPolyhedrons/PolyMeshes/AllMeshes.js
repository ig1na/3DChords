let spheres, sticks, faces;

function makeAllMeshes() {
	spheres = new Map();
	sticks = new Map();
	faces = new Map();
	labels = new THREE.Group();
	//creates all point meshes
	allPoints.forEach((point, i) => {
		let sphere = new OnePoint(point, scale);
		sphere.visible = false;
		spheres.set(i,sphere);

		scene.add(sphere);
		/*var label = new makeTextSprite(i, scale);
		labels.add(label);		*/
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
        let facePtsArray = Array.from(facePts.value);

        let face = new ThreePoints(facePtsArray, scale);
        face.visible = false;
        
		faces.set(keyFromPtSet(facePtsArray, allPoints), face);

		scene.add(face);
	}
}

function keyFromPtSet(array, indexer) {
    let sorted = array.sort((a, b) => a - b);

	if(indexer != null){
		return array.reduce((acc, v) => acc + 1 << indexer.indexOf(v), 0);
	} else {
		return array.reduce((acc, v) => acc + 1 << v, 0);
	}
}