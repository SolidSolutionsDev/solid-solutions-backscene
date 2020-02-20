import THREE, {
  WebGLRenderer,
  PerspectiveCamera,
  CubeGeometry,
  MeshBasicMaterial
} from "three";

import Physijs from "physijs-webpack";

const TIME_MAX = 3000;
const TIME_MIN = 1000;

var scene, renderer, camera, timeInit, timePassed, timeInterval;
var cubesBag = [];

const initScene = () => {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("viewport").appendChild(renderer.domElement);

  scene = new Physijs.Scene();
  camera = new PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(60, 50, 60);
  camera.lookAt(scene.position);
  scene.add(camera);

  //add main cube
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //add cubes falling
  dropCube(getNewPosition());

  timeInterval = getNewTnterval();
  timeInit = Date.now();

  requestAnimationFrame(render);
};

const getNewTnterval = () => {
  return Math.floor(Math.random() * (TIME_MAX - TIME_MIN)) + TIME_MIN;
};

const getNewPosition = () => {
  const x = Math.floor(Math.random() * (100 - 10)) - 50;
  const y = Math.floor(Math.random() * (100 - 10)) - 50;
  const z = Math.floor(Math.random() * (-5 + 5)) - 5;

  return { x, y, z };
};

const removeCubesOOS = () => {
  scene.children.forEach(cube => {
    if (cube.position.y < -100) {
      scene.remove(cube);
    }
  });
};

const render = function() {
  timePassed = Date.now() - timeInit;

  if (timePassed > timeInterval) {
    console.log("new cube");
    dropCube(getNewPosition());
    timeInit = Date.now();
    timeInterval = getNewTnterval();
  }

  removeCubesOOS();

  scene.simulate(); // run physics
  renderer.render(scene, camera); // render the scene

  requestAnimationFrame(render);
};

const dropCube = position => {
  // Box
  const box = new Physijs.BoxMesh(
    new CubeGeometry(5, 5, 5),
    new MeshBasicMaterial({ color: 0x888888 })
  );
  // const box = new Physijs.BoxMesh(
  //   new CubeGeometry(5, 5, 5),
  //   new MeshBasicMaterial({ color: 0x000000, wireframe: true })
  // );

  // wireframe
  var geo = new THREE.EdgesGeometry(box.geometry); // or WireframeGeometry
  var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
  var wireframe = new THREE.LineSegments(geo, mat);

  box.position.set(position.x, position.y, position.z);

  cubesBag.push(box);
  box.add(wireframe);
  scene.add(box);
};

window.onload = initScene();
