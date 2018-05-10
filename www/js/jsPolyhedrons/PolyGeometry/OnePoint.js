// Creates a sphere from one vector3
function OnePoint(point, scale) {
	let group = new THREE.Group();		// creates the group that will contain the mesh and the note label
	let sphere = new THREE.SphereBufferGeometry(2,50,50);
	let sphereMesh = new THREE.Mesh(sphere, RGBMaterial);
	let label = new TextSprite(point, scale);		// creates the label

	sphereMesh.position.copy(point.clone().multiplyScalar(scale));

	group.add(sphereMesh);
	group.add(label);

	return group;
}