import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import dat from "dat.gui";
function init() {
  const stats = initStats();
  const scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xcccccc, 0.015, 100);
  scene.fog = new THREE.FogExp2(0xffffff, 0.01);
  scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.add(camera);

  const axes = new THREE.AxesHelper(40);
  scene.add(axes);

  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xeeeeee);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const planeGeometry = new THREE.PlaneGeometry(60, 30, 3, 3);
  const plaenMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  const plane = new THREE.Mesh(planeGeometry, plaenMaterial);
  plane.receiveShadow = true;
  plane.rotateX(-0.5 * Math.PI);
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  spotLight.intensity = 4500;
  scene.add(spotLight);

  document.getElementById("canvas").appendChild(renderer.domElement);

  const controls = new (function () {
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;
    this.removeCube = function () {
      const allChildren = scene.children;
      const lastObj = allChildren[allChildren.length - 1];
      if (lastObj instanceof THREE.Mesh) {
        scene.remove(lastObj);
        this.numberOfObjects = scene.children.length;
      }
    };
    this.addCube = function () {
      const cubSize = Math.ceil(Math.random() * 3);
      const cubeGeometry = new THREE.BoxGeometry(cubSize, cubSize, cubSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.name = "cube-" + scene.children.length;

      cube.position.x =
        -30 + Math.round(Math.random() * planeGeometry.parameters.width);
      cube.position.y = Math.round(Math.random() * 5);
      cube.position.z =
        -20 + Math.round(Math.random() * planeGeometry.parameters.height);
      scene.add(cube);
      this.numberOfObjects = scene.children.length;
    };
    this.outputObj = function () {
      console.log(scene.children);
    };
  })();

  const gui = new dat.GUI();
  gui.add(controls, "rotationSpeed", 0, 0.5);
  gui.add(controls, "addCube");
  gui.add(controls, "removeCube");
  gui.add(controls, "outputObj");
  gui.add(controls, "numberOfObjects").listen();

  render();

  function render() {
    stats.update();
    requestAnimationFrame(render);
    scene.traverse(function (e) {
      if (e instanceof THREE.Mesh && e !== plane) {
        e.rotateX(controls.rotationSpeed);
        e.rotateY(controls.rotationSpeed);
        e.rotateZ(controls.rotationSpeed);
      }
    });
    renderer.render(scene, camera);
  }
  function initStats() {
    const stat = new Stats();
    stat.update(0);
    stat.dom.style.position = "absolute";
    stat.dom.style.top = 0;
    stat.dom.style.left = 0;
    document.getElementById("stats-output").appendChild(stat.dom);
    return stat;
  }
}
window.onload = init;
