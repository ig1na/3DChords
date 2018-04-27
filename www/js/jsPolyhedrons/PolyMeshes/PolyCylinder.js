function CylinderFromPts(v1, v2) {
	var cylinder = new THREE.CylinderBufferGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);
	var cylinderMesh = new THREE.Mesh(cylinder, RGBMaterial);
	cylinderMesh.position.copy(v1.clone().lerp(v2, .5));

	//creates quaternion from spheres position to rotate the cylinder
	var q = new THREE.Quaternion();
	q.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(v1, v2).normalize());
	cylinderMesh.setRotationFromQuaternion(q);
	return cylinderMesh;
}