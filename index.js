// import * as THREE from "https://unpkg.com/three@0.150.0/build/three.module.js";
// import * as THREE from "three";
import * as THREE from "./node_modules/three/build/three.module.min.js";
function init() {
  // scene 객체는 렌더링할 모든 객체와 사용할 모든 광원을 저장하는 데 쓰인다. THREE.Scene 없이 아무것도 레더링 할 수 없다.
  const scene = new THREE.Scene();

  // camera 객체는 장면을 렌더링 했을 때 어떻게 보여질 것인지를 정의한다.
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //renderer 객체는 scene 객체가 camera 객체의 각도에 따라 브라우저에서 어떻게 보이는지 산출하는 역할을 담당한다. 이 예제에서 장면을 렌더링하는데 그래픽카드를 사용하도록 WebGLRenderer를 생성한다.
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x888899);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //보조축
  const axes = new THREE.AxesHelper(50);
  scene.add(axes);

  //평면
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const plaenMaterial = new THREE.MeshBasicMaterial({
    color: 0x123ccc,
  });
  const plane = new THREE.Mesh(planeGeometry, plaenMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);
  //큐프
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
  scene.add(cube);
  //구체
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;
  scene.add(sphere);

  //카메라가 자면의 위에 떠다니도록 지정하고 looat함수로 장면의 중앙를 가리키도록 한다.
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  //output할 요소에 appendChild 함수로 div안에 추가하고 앞서 정의한 camera 객체를 사용해 scene을 렌더링하도록 지시
  const canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);
  renderer.render(scene, camera);
}

window.onload = init;
