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
  newUniform,
  logo,
  frontCube,
  midSphere1,
  midSphere2,
  midSphere3,
  midSphere4,
  canvas,
  clicking,
  backCube;
var cubesBag = [];
var spheresBag = [];

const initScene = () => {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

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
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);
  scene.add(camera);

  //add rotating cubes
  // frontCube = dropCube({ x: 0, y: 0, z: 5 });
  // backCube = dropCube({ x: 0, y: 0, z: -5 });

  // midSphere1 = rotatingSphere({ x: 0, y: 0, z: 0 });
  // midSphere2 = rotatingSphere({ x: 0, y: 0, z: 0 });
  // midSphere3 = rotatingSphere({ x: 0, y: 0, z: 0 });
  // midSphere4 = rotatingSphere({ x: 0, y: 0, z: 0 });

  //add logo shader
  logo = addLogo();
  //addText();

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

const render = () => {
  timePassed = Date.now() - timeInit;

  if (timePassed > timeInterval) {
    //dropCube(getNewPosition());
    timeInit = Date.now();
    timeInterval = getNewTnterval();
  }

  if (clicking) {
    if (newUniform.u_noise.value < 4) {
      newUniform.u_noise.value = newUniform.u_noise.value + 0.01;
    } else {
      newUniform.u_noise.value = 4;
    }
    spheresBag.forEach(sphere => {
      if (sphere.scale.x < 2) {
        sphere.scale.x += 0.02;
      } else {
        sphere.scale.x = 2;
      }
      if (sphere.scale.y < 2) {
        sphere.scale.y += 0.02;
      } else {
        sphere.scale.y = 2;
      }
      if (sphere.scale.z < 2) {
        sphere.scale.z += 0.02;
      } else {
        sphere.scale.z = 2;
      }
    });
  } else if (!clicking) {
    if (newUniform.u_noise.value > 1) {
      newUniform.u_noise.value = newUniform.u_noise.value - 0.05;
    } else {
      newUniform.u_noise.value = 1;
    }
    spheresBag.forEach(sphere => {
      if (sphere.scale.x > 1) {
        sphere.scale.x -= 0.1;
      } else {
        sphere.scale.x = 1;
      }
      if (sphere.scale.y > 1) {
        sphere.scale.y -= 0.1;
      } else {
        sphere.scale.y = 1;
      }
      if (sphere.scale.z > 1) {
        sphere.scale.z -= 0.1;
      } else {
        sphere.scale.z = 1;
      }
    });
  }

  rotatingComposition();
  removeCubesOOS(); //remove cubes out of sight

  newUniform.u_time.value += 0.01;
  renderer.render(scene, camera); // render the scene

  requestAnimationFrame(render);
};

const dropCube = position => {
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

const rotatingSphere = position => {
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

  // wireframe
  var geo = new THREE.EdgesGeometry(sphere.geometry); // or WireframeGeometry
  var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
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
    u_noise: { type: "1f", value: 1 }
  };

  newUniform.u_time.value = 10;
  newUniform.u_noise.value = 1;
  newUniform.u_resolution.value.x = window.innerWidth;
  newUniform.u_resolution.value.y = window.innerHeight;

  var material = new THREE.ShaderMaterial({
    uniforms: newUniform,
    fragmentShader: fragmentShader //pixel
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

//Shader example
// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//       vec2 uv = -1.0 + 2.0*fragCoord.xy / iResolution.xy;
//       uv.x *=  iResolution.x / iResolution.y;
//       vec3 color = vec3(0.0);
//       for( int i=0; i<180; i++ )
//       {
//         float pha =      sin(float(i)*1.13+1.0)*0.5 + 0.5;
//         float siz = sin(float(i)*1.74+1.0)*0.5 + 0.5;
//         float pox =      sin(float(i)*1.1) * iResolution.x / iResolution.y;
//         float rad = 0.1+0.5*siz+sin(pha+siz)/4.0;
//         vec2  pos = vec2( pox+sin(iTime/15.+pha+siz), -1.0-rad + (2.0+2.0*rad)*mod(pha+0.3*(iTime/7.)*(0.2+0.8*siz),1.0));
//         float dis = length( uv - pos );
//         vec3  col = mix( vec3(0.1*sin(iTime/6.0)+0.3,0.2,0.3*pha), vec3(1.1*sin(iTime/9.0)+0.3,0.2*pha,0.4), 0.5+0.5*sin(float(i)));
//         float f = length(uv-pos)/rad;
//         f = sqrt(clamp(1.0+(sin((iTime)*siz)*0.5)*f,0.0,1.0));
//         color += col.zyx *(1.0-smoothstep( 0.00005, 0.01, dis ));
//       }
//       color *= sqrt(1.5-0.5*length(uv));
//       fragColor = vec4(color,1.0);
// }
