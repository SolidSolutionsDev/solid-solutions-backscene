import THREE, { WebGLRenderer, PerspectiveCamera } from "three";
import theater from "theaterjs";
import fragmentShader from "../src/Utils/logo.glsl";
import { addPokemon } from "./pokemon";

import "./index.css";

const TIME_MAX = 2000;
const TIME_MIN = 500;

const windowSize = {
  width: 960,
  height: 720,
};

var scene,
  renderer,
  camera,
  timeInit,
  timePassed,
  timeInterval,
  newUniform,
  canvas,
  clicking;
var cubesBag = [];
var spheresBag = [];

var sceneObjects = [];

const initScene = () => {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(windowSize.width, windowSize.height);

  canvas = document.getElementById("viewport");
  canvas.appendChild(renderer.domElement);

  canvas.onmousedown = () => {
    clicking = true;
  };

  canvas.onmouseup = () => {
    clicking = false;
  };

  scene = new THREE.Scene();
  camera = new PerspectiveCamera(
    35,
    windowSize.width / windowSize.height,
    1,
    1000
  );
  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);

  scene.add(camera);

  const poke1 = addPokemon(1);
  const poke2 = addPokemon(2);

  poke1.init(poke2);
  poke2.init(poke1);

  scene.add(poke1.mesh);
  scene.add(poke2.mesh);

  sceneObjects.push(poke1);
  sceneObjects.push(poke2);

  timeInterval = getNewTnterval();
  timeInit = Date.now();

  requestAnimationFrame(update);
};

const getNewTnterval = () => {
  return Math.floor(Math.random() * (TIME_MAX - TIME_MIN)) + TIME_MIN;
};

const update = () => {
  timePassed = Date.now() - timeInit;

  if (timePassed > timeInterval) {
    //dropCube(getNewPosition());
    timeInit = Date.now();
    timeInterval = getNewTnterval();
  }
  renderer.render(scene, camera); // render the scene
  sceneObjects.forEach((object) => object.update());

  requestAnimationFrame(update);
};

const dropCube = (position) => {
  // Box
  var geometry = new THREE.BoxGeometry(2, 3, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x888888 });
  var box = new THREE.Mesh(geometry, material);

  // wireframe
  var geo = new THREE.EdgesGeometry(box.geometry); // or WireframeGeometry
  var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
  var wireframe = new THREE.LineSegments(geo, mat);

  box.position.set(position.x, position.y, position.z);

  cubesBag.push(box);
  box.add(wireframe);
  scene.add(box);

  return box;
};

const rotatingSphere = (position) => {
  var startingAngle = Math.random() * Math.PI;

  // Box
  var geometry = new THREE.SphereGeometry(
    2,
    32,
    16,
    startingAngle,
    Math.PI / 8,
    0,
    Math.PI
  );
  var material = new THREE.MeshBasicMaterial({ color: 0x888888 });
  material.side = THREE.DoubleSide;
  var sphere = new THREE.Mesh(geometry, material);

  var color2 = new THREE.Color(`rgb(${128}, 128, 128)`);

  // wireframe
  var geo = new THREE.EdgesGeometry(sphere.geometry); // or WireframeGeometry
  var mat = new THREE.LineBasicMaterial({
    color: color2,
    linewidth: 2,
  });
  var wireframe = new THREE.LineSegments(geo, mat);

  sphere.position.set(position.x, position.y, position.z);

  sphere.add(wireframe);
  scene.add(sphere);
  spheresBag.push(sphere);

  return sphere;
};

const addLogo = () => {
  newUniform = {
    u_time: { type: "1f", value: 0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
  };

  newUniform.u_time.value = 10;
  newUniform.u_noise.value = 1;
  newUniform.u_resolution.value.x = window.innerWidth;
  newUniform.u_resolution.value.y = window.innerHeight;

  var material = new THREE.ShaderMaterial({
    uniforms: newUniform,
    fragmentShader: fragmentShader, //pixel
  });

  material.transparent = true;

  var geometry = new THREE.PlaneBufferGeometry(100, 100);
  var mesh = new THREE.Mesh(geometry, material);

  mesh.lookAt(camera.position);
  scene.add(mesh);

  return mesh;
};

const addText = () => {
  //add text
  var loader = new THREE.FontLoader();
  loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
    var geometry = new THREE.TextGeometry("SOLID", {
      font: font,
      size: 10,
      height: 3,
      curveSegments: 5,
      bevelEnabled: false,
      bevelThickness: 0.1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1,
    });

    var material = new THREE.MeshBasicMaterial({ color: 0x044922 });
    var mesh = new THREE.Mesh(geometry, material);

    var geo = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    var wireframe = new THREE.LineSegments(geo, mat);

    mesh.position.set(-20, -5, 10);
    mesh.lookAt(camera.position);
    mesh.add(wireframe);
    scene.add(mesh);
  });
};

const removeCubesOOS = () => {
  scene.children.forEach((cube) => {
    if (cube.position.y < -100) {
      scene.remove(cube);
    }
  });
};

const rotatingComposition = () => {
  var orbitSpeed = Date.now() * 0.001;
  var orbitDistance = 5;

  // frontCube.position.set(
  //   Math.cos(orbitSpeed) * orbitDistance,
  //   0,
  //   Math.sin(orbitSpeed) * orbitDistance
  // );

  // frontCube.rotation.set(newUniform.u_time.value, 50, 20);

  // frontCube.lookAt(logo.position);

  // backCube.position.set(
  //   Math.cos(orbitSpeed + Math.PI) * orbitDistance,
  //   0,
  //   Math.sin(orbitSpeed + Math.PI) * orbitDistance
  // );

  // backCube.rotation.set(newUniform.u_time.value, 50, 20);

  // backCube.lookAt(logo.position);

  // midSphere2.rotation.set(45, newUniform.u_time.value * 2, 0);
  // midSphere1.rotation.set(0, -newUniform.u_time.value * 2, 0);
  // midSphere3.rotation.set(180, -newUniform.u_time.value * 2, 0);
  // midSphere4.rotation.set(90, -newUniform.u_time.value * 2, 0);
};

const getNewPosition = () => {
  const x = Math.floor(Math.random() * (100 - 10)) - 50;
  const y = Math.floor(Math.random() * (100 - 10)) - 50;
  const z = Math.floor(Math.random() * (-5 + 5)) - 5;

  return { x, y, z };
};

window.onload = initScene();
