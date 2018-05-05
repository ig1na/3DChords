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
	//console.log(ptsIndexes);
	// let vertices = [];
	// ptsIndexes.forEach(index => {
	// 	vertices.push(allPoints[index].clone());
	// });
	// // console.log('vertices', vertices);

	// let geometry = new THREE.ConvexBufferGeometry(vertices);
	// // console.log('geometry', geometry);
	// geometry.faces.forEach(face => {
	// 	let pt1 = face.getEdge(0).head().point,
	// 		pt2 = face.getEdge(1).head().point,
	// 		pt3 = face.getEdge(2).head().point;
	// 	// console.log('face', face);
	// 	// console.log('pt1', pt1);
	// 	// console.log('pt2', pt2);
	// 	// console.log('pt3', pt3);
	// 	let index1 = allPoints.map(function(e) { return e.equals(pt1) }).indexOf(true),
	// 		index2 = allPoints.map(function(e) { return e.equals(pt2) }).indexOf(true),
	// 		index3 = allPoints.map(function(e) { return e.equals(pt3) }).indexOf(true);
	// 	showThreePoints([index1, index2, index3]);
	// });

	//const indexes = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

	const gen = subsets(ptsIndexes, 3);
	let threePts;

	while(!(threePts = gen.next()).done) {
		showThreePoints(Array.from(threePts.value));
	}


}

/*function makeTransparent(geometry, group) {
	//geometry.computeVertexNormals();
	//geometry.computeFaceNormals();
	group.add(new THREE.Mesh(geometry, transparentMaterialFront));
}*/