import THREE, {
  WebGLRenderer,
  PerspectiveCamera,
  CubeGeometry,
  MeshBasicMaterial
} from "three";
import fragmentShader from "../src/Utils/logo.glsl";

const TIME_MAX = 2000;
const TIME_MIN = 500;

var scene,
  renderer,
  camera,
  timeInit,
  timePassed,
  timeInterval,
  text,
  newUniform;
var cubesBag = [];

const initScene = () => {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("viewport").appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(scene.position);
  scene.add(camera);

  //add cubes falling
  dropCube(getNewPosition());

  //add logo shader
  addLogo();
  addText();

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

  newUniform.u_time.value += 0.05;
  renderer.render(scene, camera); // render the scene

  requestAnimationFrame(render);
};

const dropCube = position => {
  // Box
  var geometry = new THREE.BoxGeometry(1, 1, 1);
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
};

const addLogo = () => {
  newUniform = {
    u_time: { type: "1f", value: 0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() }
  };

  newUniform.u_time.value += 0.05;
  newUniform.u_resolution.value.x = window.innerWidth;
  newUniform.u_resolution.value.y = window.innerHeight;

  var material = new THREE.ShaderMaterial({
    uniforms: newUniform,
    fragmentShader: fragmentShader //pixel
  });

  var geometry = new THREE.PlaneBufferGeometry(100, 100);
  var mesh = new THREE.Mesh(geometry, material);

  const geometryCube = new THREE.BoxGeometry(1, 1, 1);
  const materialCube = new THREE.MeshBasicMaterial({ color: "#FF0000" });
  var cube = new THREE.Mesh(geometryCube, materialCube);
  mesh.lookAt(camera.position);
  scene.add(mesh);
};

const addText = () => {
  //add text
  var loader = new THREE.FontLoader();
  loader.load("fonts/helvetiker_regular.typeface.json", function(font) {
    var geometry = new THREE.TextGeometry("SOLID", {
      font: font,
      size: 10,
      height: 3,
      curveSegments: 5,
      bevelEnabled: false,
      bevelThickness: 0.1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
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

window.onload = initScene();
