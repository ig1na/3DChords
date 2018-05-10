function TwoPoints(point1, point2, scale) {
	let v1 = point1.clone().multiplyScalar(scale);
	let v2 = point2.clone().multiplyScalar(scale);
	let cylinderMesh = new CylinderFromPts(v1, v2);
	
	this.group = new THREE.Group();
	this.group.add(cylinderMesh);

	return this.group;
}