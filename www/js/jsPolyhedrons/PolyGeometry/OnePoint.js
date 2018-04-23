function OnePoint(noteVal, scale) {
	var sphere = new THREE.SphereGeometry(2,50,50);
	var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

	sphereMesh.position.copy(allPoints[noteVal].clone().multiplyScalar(scale))

	return sphereMesh;
}