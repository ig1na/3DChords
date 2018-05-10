function ThreePoints(points, scale) {
	this.group = new THREE.Group();
	let mesh;
	let geometry = new THREE.BufferGeometry();
	let positions = [];
	let normals = [];
	let material = new THREE.MeshStandardMaterial( {
		opacity: 0.2,
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide
	} );
	
	for(let point of points) {
		positions.push(point.clone().x);
		positions.push(point.clone().y);
		positions.push(point.clone().z);
		normals.push(1,1,1);
	}

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.scale(scale, scale, scale);

	mesh = new THREE.Mesh( geometry, material.clone() );
	this.group.add( mesh );

	return this.group;
}