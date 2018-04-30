//creates and returns an array of two meshes to create transparency
function TranspMeshGrp(geometry) {
	var group = new THREE.Group();
	var meshGeometry = new THREE.ConvexBufferGeometry(geometry.vertices);

	var faces = meshGeometry.faces;
	for(var face in faces) {
		for(var i=0; i<3; i++) {
			var v1 = faces[face].getEdge(i).head();
			var v2 = faces[face].getEdge(i).tail();
			group.add(new CylinderFromPts(v1.point, v2.point));
		}
	}

	var mesh = new THREE.Mesh(meshGeometry, transparentMaterialBack);
	mesh.material.side = THREE.BackSide; // back faces
	mesh.renderOrder = 0;

	var mesh2 = new THREE.Mesh(meshGeometry, transparentMaterialFront.clone());
	mesh2.material.side = THREE.FrontSide; // front faces
	mesh2.renderOrder = 1;

	group.add(mesh);
	group.add(mesh2);

	return group;
}

function showPolyhedron(ptsIndexes) {
	let vertices = [];
	ptsIndexes.forEach(index => {
		vertices.push(allPoints[index].clone());
	});

	let geometry = new THREE.ConvexBufferGeometry(vertices);

	geometry.faces.forEach(face => {
		console.log('face edge', face.getEdge(0).head().point);
		let index1 = allPoints.indexOf(face.getEdge(0).head().point),
			index2 = allPoints.indexOf(face.getEdge(1).head().point),
			index3 = allPoints.indexOf(face.getEdge(2).head().point);
		showThreePoints([index1, index2, index3]);
	});

}

/*function makeTransparent(geometry, group) {
	//geometry.computeVertexNormals();
	//geometry.computeFaceNormals();
	group.add(new THREE.Mesh(geometry, transparentMaterialFront));
}*/