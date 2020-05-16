import THREE, { WebGLRenderer, PerspectiveCamera } from "three";
import Theater from "theaterjs"; // {https://github.com/Zhouzi/TheaterJS
//https://jsfiddle.net/p1e9La6w/
import fragmentShader from "../src/Utils/logo.glsl";
import { addPokemon } from "./pokemon";

import "./index.css";

const windowSize = {
  width: 960,
  height: 720,
};

var scene, renderer, camera, canvas;

var sceneObjects = [];

var gameProps = {};

const initScene = () => {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(windowSize.width, windowSize.height);

  canvas = document.getElementById("viewport");
  canvas.appendChild(renderer.domElement);

  gameProps.theater = Theater({
    minSpeed: {
      erase: 1,
      type: 80,
    },

    maxSpeed: {
      erase: 1,
      type: 450,
    },
  });
  gameProps.theater
    .addActor("first_line", { accuracy: 0.9, speed: 1.5 })
    .addActor("second_line", { accuracy: 0.9, speed: 1.5 });

  gameProps.theater.on("sequence:end", function () {});

  gameProps.availableActors = [
    document.getElementById("first_line"),
    document.getElementById("second_line"),
  ];

  gameProps.state = {
    gameReady: false,
    playerTurn: [false, false],
    playerDone: [false, false],
    inBetweenTurns: false,
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

  const poke1 = addPokemon(1, gameProps);
  const poke2 = addPokemon(2, gameProps);

  poke1.init(poke2);
  poke2.init(poke1);

  scene.add(poke1.mesh);
  scene.add(poke2.mesh);

  sceneObjects.push(poke1);
  sceneObjects.push(poke2);

  requestAnimationFrame(update);

  gameProps.state.gameReady = true;
  gameProps.state.playerTurn[0] = true;
};

const update = () => {
  //STATE (1) INITING - Initing game

  //STATE (2) BATTLE SCENE - a battle is going on!

  //STATE (2.1) BETWEEN TURNS - awaiting for attack animations
  if (gameProps.state.inBetweenTurns) {
  } else if (!gameProps.state.inBetweenTurns) {
    //STATE (2.2) PLAYER 2 TURN
    if (gameProps.state.playerDone[0]) {
      gameProps.state.playerTurn[1] = true;
      gameProps.state.playerDone[0] = false;
    }
    //STATE (2.3) PLAYER 2 TURN
    else if (gameProps.state.playerDone[1]) {
      gameProps.state.playerTurn[0] = true;
      gameProps.state.playerDone[1] = false;
    }
  }

  //STATE (3) END BATTLE SCREEN - a battle is going on!

  //STATE (4) GAME MENU

  renderer.render(scene, camera);
  sceneObjects.forEach((object) => object.update());

  requestAnimationFrame(update);
};

window.onload = initScene();
