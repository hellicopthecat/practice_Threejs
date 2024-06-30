// import * as THREE from "https://unpkg.com/three@0.150.0/build/three.module.js";
// import * as THREE from "three";
import * as THREE from "./node_modules/three/build/three.module.min.js";
function init() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  //그림자를 만들기위해  몇가지를 추가
  renderer.setClearColor(0x888899, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const axes = new THREE.AxesHelper(50);
  scene.add(axes);

  //광원을 추가하고 사물이 광원을 제공받으려면 MeshBasicMaterial말고 MeshLambertMaterial를 사용해야한다.
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

  //광원을 추가하는 방법
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  //광원과 그림자를 추가햇는데 사물이 검게 나온다면 아래의 코드로 광원을 밝혀주자
  spotLight.intensity = 10000;
  spotLight.castShadow = true;
  scene.add(spotLight);

  const canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);
  renderer.render(scene, camera);
}

window.onload = init;
