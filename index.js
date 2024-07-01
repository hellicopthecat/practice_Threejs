import Stats from "./node_modules/three/examples/jsm/libs/stats.module.js";
import * as THREE from "./node_modules/three/build/three.module.min.js";
import * as dat from "./node_modules/dat.gui/build/dat.gui.module.js";

// 현재 얼만큼의 메모리를 사용하는지 혹은 얼만큼의 frame을 유지하고 있는지 볼수있는 stat이다.
// 이것은 stats.js가 원본이며 threejs내부에 examples에 들어있다.
// showPanel의 값에 따라 나타내는것이 다르다 (0~2)
function initStats() {
  const stats = new Stats();
  stats.showPanel(0);
  // stats.showPanel(1);
  // stats.showPanel(2);
  stats.dom.style.position = "absolute";
  stats.dom.style.left = "0px";
  stats.dom.style.top = "0px";
  document.getElementById("stats-output").appendChild(stats.dom);
  return stats;
}
function init() {
  const stats = initStats();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
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

  // 움직일 사물의 처음 기준점
  let step = 0;

  // google 엔지니어들이 만든 라이브러리 dat.GUI
  const controls = new (function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
  })();
  const gui = new dat.GUI();
  gui.add(controls, "rotationSpeed", 0, 0.5);
  gui.add(controls, "bouncingSpeed", 0, 0.5);

  function renderScene() {
    // stat보기
    stats.update();
    // 큐브의 회전
    cube.rotateX(controls.rotationSpeed);
    cube.rotateY(controls.rotationSpeed);
    cube.rotateZ(controls.rotationSpeed);
    // 움직일 사물이 얼만큼씩 갈건지 수치를 지정
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    //사물에게 동작을 추가하기 위해서 작성해야하는 코드다. setInterval은 브라우저에 무리가 가며 자체함수를 호출해 동작이 지속적으로 움직이게 할수 있다.
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
  const canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);
  renderScene();
}

window.onload = init;
