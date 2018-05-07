function OnePoint(point, scale) {
	let group = new THREE.Group();
	let sphere = new THREE.SphereBufferGeometry(2,50,50);
	let sphereMesh = new THREE.Mesh(sphere, RGBMaterial);
	let label = makeTextSprite(point, scale);

	sphereMesh.position.copy(point.clone().multiplyScalar(scale));

	group.add(sphereMesh);
	group.add(label);

	console.log(group);
	
	return group;
}

function showOnePoint(index) {
	spheres.get(index).visible = true;
}