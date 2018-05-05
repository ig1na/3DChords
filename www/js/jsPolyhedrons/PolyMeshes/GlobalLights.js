function GlobalLights(distFromMid) {
	const distance = distFromMid;
	const lightsGroup = new THREE.Group();

	//top lights
	let pointLight1 = new THREE.PointLight(0xff0000, 1, 100);
	pointLight1.position.set(distance, distance, distance);
	lightsGroup.add(pointLight1);

	/*let helper = new THREE.PointLightHelper(pointLight1, 1);
	lightsGroup.add(helper);*/

	let pointLight2 = new THREE.PointLight(0x00ff00, 1, 100);
	pointLight2.position.set(distance, distance, -distance);
	lightsGroup.add(pointLight2);

	/*let helper = new THREE.PointLightHelper(pointLight2, 1);
	lightsGroup.add(helper);*/

	let pointLight3 = new THREE.PointLight(0xffff00, 1, 100);
	pointLight3.position.set(-distance, distance, distance);
	lightsGroup.add(pointLight3);

	/*let helper = new THREE.PointLightHelper(pointLight3, 1);
	lightsGroup.add(helper);*/

	let pointLight4 = new THREE.PointLight(0x0000ff, 1, 100);
	pointLight4.position.set(-distance, distance, -distance);
	lightsGroup.add(pointLight4);

	/*let helper = new THREE.PointLightHelper(pointLight4, 1);
	lightsGroup.add(helper);*/


	//bottom lights
	let pointLight5 = new THREE.PointLight(0x00ffff, 1, 100);
	pointLight5.position.set(distance, -distance, distance);
	lightsGroup.add(pointLight5);

	/*let helper = new THREE.PointLightHelper(pointLight5, 1);
	lightsGroup.add(helper);*/

	let pointLight6 = new THREE.PointLight(0xff00ff, 1, 100);
	pointLight6.position.set(distance, -distance, -distance);
	lightsGroup.add(pointLight6);

	/*let helper = new THREE.PointLightHelper(pointLight6, 1);
	lightsGroup.add(helper);
*/
	let pointLight7 = new THREE.PointLight(0xff8888, 1, 100);
	pointLight7.position.set(-distance, -distance, distance);
	lightsGroup.add(pointLight7);

	/*let helper = new THREE.PointLightHelper(pointLight7, 1);
	lightsGroup.add(helper);*/

	let pointLight8 = new THREE.PointLight(0x8888ff, 1, 100);
	pointLight8.position.set(-distance, -distance, -distance);
	lightsGroup.add(pointLight8);

	/*let helper = new THREE.PointLightHelper(pointLight8, 1);
	lightsGroup.add(helper);*/



	//middle light
	/*let pointLight9 = new THREE.PointLight(0xffffff, 1, 100);
	pointLight9.position.set(x, y, z);
	lightsGroup.add(pointLight9);

	let helper = new THREE.PointLightHelper(pointLight9, 1);
	group.add(helper);*/
	return lightsGroup;
}