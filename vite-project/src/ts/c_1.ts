import * as Three from "three";

const a = new Three.Vector3(1, 0, 0);
const b = new Three.Vector3(0, 1, 0);

const sum = a.clone().add(b);
const dist = a.distanceTo(b);
const normalized = sum.clone().normalize();

console.log("SUM :: ", sum);
console.log("dist :: ", dist);
console.log("nomalized :: ", normalized);

const group = new Three.Group();
group.rotation.y = Math.PI / 4;

const child = new Three.Mesh(
  new Three.BoxGeometry(),
  new Three.MeshBasicMaterial({color: 0x00ff00}),
);

child.position.set(2, 0, 0);
group.add(child);

console.log("child.position :: ", child.position);
console.log(
  "child.getWorldPosition :: ",
  child.getWorldPosition(new Three.Vector3()),
);
