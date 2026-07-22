import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/Addons.js";

const scene = new Three.Scene();
const cam = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
cam.position.z = 10;

// let aspect = 1;
// const d = 1;
// const cam = new Three.OrthographicCamera(
//   -d * aspect,
//   d * aspect,
//   d,
//   -d,
//   0.1,
//   1000,
// );
cam.position.set(5, 10, 5);
cam.lookAt(0, 0, 0);

const renderer = new Three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const box = new Three.BoxGeometry(1, 2, 3);
const sphere = new Three.SphereGeometry(1, 32, 32);
const cone = new Three.ConeGeometry(1, 2, 32);
const torus = new Three.TorusGeometry(1, 0.4, 16, 100);

const arr = [box, sphere, cone, torus];

const geometry = new Three.BoxGeometry();
// const meterial = new Three.MeshBasicMaterial({
//   color: 0x44aa88,
//   wireframe: true,
// });

const meterial = new Three.MeshStandardMaterial({
  color: 0xff6633,
  roughness: 0.2,
  metalness: 0.8,
});
// 실무에서는 Ambient + Directioncal 조합
// 분위기 살리기 이ㅜ해서는 Point나 SpotLight
const ambientLight = new Three.AmbientLight(0xffffff, 1); // 균일광
scene.add(ambientLight);

const directionalLight = new Three.DirectionalLight(0xffffff, 3); // 태양광
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const point = new Three.PointLight(0x123fff, 120, 130); // 포인트 라이트 / 색 , 강도, 도달거리
point.position.set(-3, 2, 3);
scene.add(point);

const spot = new Three.SpotLight(0xbeed2a, 150);
spot.position.set(3, 12, 3);
spot.angle = Math.PI / 6; // 원뿔각도
spot.penumbra = 0.3; // 가장자리 부드러움
scene.add(spot);

const cube = new Three.Mesh(geometry, meterial);

arr.map((geo, i) => {
  const mesh = new Three.Mesh(geo, meterial);
  mesh.position.x = i * 2.5 - 3.75;
  scene.add(mesh);
  return mesh;
});

scene.add(cube);

const controls = new OrbitControls(cam, renderer.domElement);
controls.enableDamping = true; // 관성효과
controls.dampingFactor = 0.05;

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 관성시 update 필수
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, cam);
}

animate();
