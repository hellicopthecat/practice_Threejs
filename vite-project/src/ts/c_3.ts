import * as THREE from "three";
import {
  EXRLoader,
  HDRLoader,
  OrbitControls,
} from "three/examples/jsm/Addons.js";

const hdrLoader = new EXRLoader();
hdrLoader.load("/valley_of_desolation_4k.exr", (txt) => {
  txt.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = txt;
  scene.background = txt;
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const axeHelper = new THREE.AxesHelper(10);
scene.add(axeHelper);

const cam = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
cam.position.z = 5;
cam.position.set(25, 28, 55);
cam.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const box = new THREE.BoxGeometry(10, 15, 17);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.1,
  metalness: 1,
  envMapIntensity: 2,
});

const cube = new THREE.Mesh(box, material);
scene.add(cube);

cube.rotation.x = -Math.PI / 2;
cube.receiveShadow = true;

const ambi = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambi);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(8, 5, 165);
scene.add(light);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
light.castShadow = true;
light.shadow.mapSize.set(1024, 1024);
light.shadow.camera.near = 1;
light.shadow.camera.far = 20;

const controls = new OrbitControls(cam, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function renderFn() {
  requestAnimationFrame(renderFn);
  controls.update();
  renderer.render(scene, cam);
}
renderFn();
