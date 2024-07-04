import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import * as dat from "dat.gui";

//화면의 종횡비가 변화하기 때문에 보여주고자하는 것들은 함수의 외부로 이동해 다른 함수에서도 사용할 수 있게 해준다.
let camera;
let scene;
let renderer;
function initStats() {
  const stats = new Stats();
  stats.showPanel(0);
  stats.dom.style.position = "absolute";
  stats.dom.style.left = "0px";
  stats.dom.style.top = "0px";
  document.getElementById("stats-output").appendChild(stats.dom);
  return stats;
}
function init() {
  const stats = initStats();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(0x888899, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const axes = new THREE.AxesHelper(50);
  scene.add(axes);

  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const plaenMaterial = new THREE.MeshLambertMaterial({
    color: 0x123ccc,
  });
  const plane = new THREE.Mesh(planeGeometry, plaenMaterial);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;

  scene.add(plane);
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;

  scene.add(cube);

  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;

  scene.add(sphere);

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.intensity = 15000;
  spotLight.castShadow = true;
  scene.add(spotLight);

  const controls = new (function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
  })();
  const gui = new dat.GUI();
  gui.add(controls, "rotationSpeed", 0, 0.5);
  gui.add(controls, "bouncingSpeed", 0, 0.5);

  let step = 0;
  function renderScene() {
    stats.update();

    cube.rotateX(controls.rotationSpeed);
    cube.rotateY(controls.rotationSpeed);
    cube.rotateZ(controls.rotationSpeed);

    step += controls.bouncingSpeed;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
  const canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);
  renderScene();
}
//반응형으로 만들기
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);
window.onload = init;
