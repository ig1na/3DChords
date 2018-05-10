//Creates a cylinder between the two given vector3
function CylinderFromPts(v1, v2) {
	let cylinder = new THREE.CylinderBufferGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);
	let cylinderMesh = new THREE.Mesh(cylinder, RGBMaterial);
	let q = new THREE.Quaternion();																		

	cylinderMesh.position.copy(v1.clone().lerp(v2, .5));	//moves the mesh to the middle of the two points
	
	q.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(v1, v2).normalize());		//uses the two vectors to set the quaternion
	cylinderMesh.setRotationFromQuaternion(q);		// uses the quaternion to rotate the mesh
	
	return cylinderMesh;
}