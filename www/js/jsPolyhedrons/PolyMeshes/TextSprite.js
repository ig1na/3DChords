function makeTextSprite( point, scale, parameters )
{
	let map, sprite, material;

	let textureLoader = new THREE.TextureLoader();
	let note = allPoints.indexOf(point);
	

	switch(note) {
		case 0: map = textureLoader.load('sprites/C.png');
				break;
		case 1: map = textureLoader.load('sprites/CS.png');
				break;
		case 2: map = textureLoader.load('sprites/D.png');
				break;
		case 3: map = textureLoader.load('sprites/DS.png');
				break;
		case 4: map = textureLoader.load('sprites/E.png');
				break;
		case 5: map = textureLoader.load('sprites/F.png');
				break;
		case 6: map = textureLoader.load('sprites/FS.png');
				break;
		case 7: map = textureLoader.load('sprites/G.png');
				break;
		case 8: map = textureLoader.load('sprites/GS.png');
				break;
		case 9: map = textureLoader.load('sprites/A.png');
				break;
		case 10: map = textureLoader.load('sprites/AS.png');
				break;
		case 11: map = textureLoader.load('sprites/B.png');
				break;
	}

	console.log(map);

	material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true });

	sprite = new THREE.Sprite(material);

	sprite.position.copy(point.clone().multiplyScalar(scale));

	return sprite;	
}