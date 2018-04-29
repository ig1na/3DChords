function OnePoint(point, scale) {
	var sphere = new THREE.SphereBufferGeometry(2,50,50);
	var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

	sphereMesh.position.copy(point.clone().multiplyScalar(scale));

	return sphereMesh;
}