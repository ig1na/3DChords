// Creates a sprite to display note name
function TextSprite( point, scale )
{
	let map, sprite, material;
	let textureLoader = new THREE.TextureLoader();
	let note = allPoints.indexOf(point);

	// loads the image depending on the note number
	switch(note) {
		case 0: map = textureLoader.load('js/sprites/C.png');
				break;
		case 1: map = textureLoader.load('js/sprites/CS.png');
				break;
		case 2: map = textureLoader.load('js/sprites/D.png');
				break;
		case 3: map = textureLoader.load('js/sprites/DS.png');
				break;
		case 4: map = textureLoader.load('js/sprites/E.png');
				break;
		case 5: map = textureLoader.load('js/sprites/F.png');
				break;
		case 6: map = textureLoader.load('js/sprites/FS.png');
				break;
		case 7: map = textureLoader.load('js/sprites/G.png');
				break;
		case 8: map = textureLoader.load('js/sprites/GS.png');
				break;
		case 9: map = textureLoader.load('js/sprites/A.png');
				break;
		case 10: map = textureLoader.load('js/sprites/AS.png');
				break;
		case 11: map = textureLoader.load('js/sprites/B.png');
				break;
	}

	material = new THREE.SpriteMaterial( { map: map, color: 0xffffff });	// creates a material and maps the image to it

	sprite = new THREE.Sprite(material);	//creates the sprite from the material

	sprite.position.copy(point.clone().multiplyScalar(scale+5));
	sprite.scale.set(5,5,5);	// scale sprite to make it bigger

	return sprite;	
}