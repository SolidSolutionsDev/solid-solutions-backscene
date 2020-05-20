import * as THREE from "three";
import { awesomeLines, pokeList, sphereOptions, playerStats } from "./states";
import {
  reparentObject3D,
  drawCircleOnCanvas,
  rgbToHex,
  rgb2xy,
  xy2polar,
} from "./Utils/utils";
import { addColorSphere } from "./ColorSphere";
import { addCylinder } from "./Cylinder";

export function addPokemon(_playerNumber, gameProps) {
  let pokemon = {};
  let playerNumber = _playerNumber;
  let attacksMenu, indicator, circleCanvas;
  pokemon.childrenObjects = [];

  pokemon.state = {
    init: false,
    animating: false,
    playerNumber: playerNumber,
    myTurn: true,
    isBot: playerStats[playerNumber - 1].isBot,
    isInsideDeathRadius: false,
    fainted: false,
  };

  pokemon.stats = {
    name: playerStats[playerNumber - 1].name,
    colors: {
      r: playerStats[playerNumber - 1].initColor.r,
      g: playerStats[playerNumber - 1].initColor.g,
      b: playerStats[playerNumber - 1].initColor.b,
    },
    focusColor: {
      r: 0,
      g: 0,
      b: 0,
    },
    deathRadius: playerStats[playerNumber - 1].deathRadius,
    deathRadiusVolatility: playerStats[playerNumber - 1].deathRadiusVolatility,
  };

  pokemon.createSprite = (startingColor) => {
    let map;
    if (playerNumber == 2) {
      map = new THREE.TextureLoader().load(
        "../../images/solid1_front_nb_s.gif"
      );
    } else {
      map = new THREE.TextureLoader().load("../../images/solid1_back_nb_s.gif");
    }
    let material = new THREE.SpriteMaterial({ map: map, color: startingColor });
    let pokeSprite = new THREE.Sprite(material);

    //pokeSprite.scale.set(10, 10, 1);

    pokeSprite.material.color = new THREE.Color(0xff66cc);

    return pokeSprite;
  };

  pokemon.createCubeMesh = (startingColor) => {
    let geometry = new THREE.BoxGeometry(2, 3, 3);
    let material = new THREE.MeshBasicMaterial({ color: startingColor });
    let pokeMesh = new THREE.Mesh(geometry, material);

    let geo = new THREE.EdgesGeometry(pokeMesh.geometry); // or WireframeGeometry
    let mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    let wireframe = new THREE.LineSegments(geo, mat);

    let geom = new THREE.CircleGeometry(4, 32);
    let mate = new THREE.MeshBasicMaterial({ color: 0x666666 });
    let circle = new THREE.Mesh(geom, mate);

    circle.rotation.set(-1.3, 0, 0);
    circle.position.set(0, -2, 0);

    pokeMesh.add(circle);
    pokeMesh.add(wireframe);

    return pokeMesh;
  };

  pokemon.createCylinderMesh = (startingColor) => {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: startingColor });
    let pivotMesh = new THREE.Mesh(geometry, material);

    let pokeCylinder = addCylinder(pivotMesh);

    return [pokeCylinder.mesh, pokeCylinder.update];
  };

  let startingColor = new THREE.Color(
    `rgb(${pokemon.stats.colors.r}, ${pokemon.stats.colors.g}, ${pokemon.stats.colors.b})`
  );

  //pokemon.mesh = pokemon.createCubeMesh(startingColor);
  [pokemon.mesh, pokemon.mesh.update] = pokemon.createCylinderMesh(
    startingColor
  );

  pokemon.mesh.position.set(
    playerStats[playerNumber - 1].position.x,
    playerStats[playerNumber - 1].position.y,
    playerStats[playerNumber - 1].position.z
  );
  pokemon.mesh.rotation.set(
    playerStats[playerNumber - 1].rotation.x,
    playerStats[playerNumber - 1].rotation.y,
    playerStats[playerNumber - 1].rotation.z
  );

  pokemon.addColor = (colorDamage) => {
    pokemon.stats.colors = {
      r:
        pokemon.stats.colors.r + colorDamage.r > 255
          ? 255
          : pokemon.stats.colors.r + colorDamage.r,
      g:
        pokemon.stats.colors.g + colorDamage.g > 255
          ? 255
          : pokemon.stats.colors.g + colorDamage.g,
      b:
        pokemon.stats.colors.b + colorDamage.b > 255
          ? 255
          : pokemon.stats.colors.b + colorDamage.b,
    };

    pokemon.updateColorIndicatorAndMesh();
  };

  pokemon.removeColor = (_colorDamage) => {
    let colorDamage = {
      r: Math.floor(_colorDamage.r * sphereOptions.startingSize * 0.5),
      g: Math.floor(_colorDamage.g * sphereOptions.startingSize * 0.5),
      b: Math.floor(_colorDamage.b * sphereOptions.startingSize * 0.5),
    };

    pokemon.stats.colors = {
      r:
        pokemon.stats.colors.r - colorDamage.r < 0
          ? 0
          : pokemon.stats.colors.r - colorDamage.r,
      g:
        pokemon.stats.colors.g - colorDamage.g < 0
          ? 0
          : pokemon.stats.colors.g - colorDamage.g,
      b:
        pokemon.stats.colors.b - colorDamage.b < 0
          ? 0
          : pokemon.stats.colors.b - colorDamage.b,
    };

    pokemon.updateColorIndicatorAndMesh();
  };

  pokemon.updateColorIndicatorAndMesh = () => {
    let newColor = new THREE.Color(
      `rgb(${Math.floor(pokemon.stats.colors.r)}, ${Math.floor(
        pokemon.stats.colors.g
      )}, ${Math.floor(pokemon.stats.colors.b)})`
    );

    pokemon.mesh.material.color.set(newColor);

    pokemon.updateIndicator();
  };

  pokemon.updateIndicator = () => {
    const position = rgb2xy(
      pokemon.stats.colors.r,
      pokemon.stats.colors.g,
      pokemon.stats.colors.b
    );

    let [r, phi] = xy2polar(position.x, position.y);

    if (!pokemon.state.isInsideDeathRadius && r < pokemon.stats.deathRadius) {
      pokemon.deathSavingThrow();
      pokemon.state.isInsideDeathRadius = true;
    } else if (pokemon.state.isInsideDeathRadius) {
      pokemon.state.isInsideDeathRadius = false;
    }

    indicator.style.left = circleCanvas.offsetLeft - 4 - position.x + 50 + "px";
    indicator.style.top = circleCanvas.offsetTop - position.y + 50 + "px";
  };

  pokemon.deathSavingThrow = () => {
    let savingThrow = Math.random() * 100;

    pokemon.state.fainted =
      savingThrow < pokemon.stats.deathRadiusVolatility ? true : false;

    console.log(savingThrow, pokemon.state.fainted);

    if (pokemon.state.fainted) {
      pokemon.addDialog("just fainted!");
    }
  };

  pokemon.initAttackUI = () => {
    attacksMenu = document.getElementById(`slot${playerNumber}_attacks`);
    indicator = document.getElementById(`slot${playerNumber}_indicator`);
    if (!playerStats[playerNumber - 1].isBot) {
      playerStats[playerNumber - 1].attacks.forEach((attack) => {
        let attackBtn = document.createElement("button");
        attackBtn.innerHTML = attack.label;
        attackBtn.style.backgroundColor = rgbToHex(attack.damage);
        attackBtn.id = "btn";

        attackBtn.onclick = () => {
          if (gameProps.state.playerTurn[_playerNumber - 1]) {
            pokemon.startAttack(attack);
          }
        };
        attacksMenu.appendChild(attackBtn);
      });
    }
  };

  pokemon.addDialog = (text) => {
    gameProps.theater.addScene(
      `second_line:`,
      -20,
      `first_line:`,
      -20,
      `first_line: ${pokemon.stats.name} ${text}`,
      `second_line: ${
        awesomeLines[Math.floor(Math.random() * awesomeLines.length)]
      }`
    );
  };

  pokemon.startAttack = (attack) => {
    gameProps.state.playerDone[_playerNumber - 1] = true;
    gameProps.state.playerTurn[_playerNumber - 1] = false;
    gameProps.state.inBetweenTurns = true;

    attacksMenu.style.display = "none";
    pokemon.updateIndicator();

    pokemon.addDialog(attack.dialog);

    if (attack.type == "absorb") {
      addColorSphere(pokemon, attack.damage);
      pokemon.opponent.removeColor(attack.damage);
    } else if (attack.type == "recharge") {
      pokemon.childrenObjects.forEach(
        (children) => (children.stats.size += 0.2)
      );
    } else if (attack.type == "discharge") {
      pokemon.childrenObjects.forEach(
        (children) => (children.state.attacking = true)
      );
    } else {
      pokemon.opponent.addColor(attack.damage);
    }

    setTimeout(() => {
      gameProps.state.inBetweenTurns = false;
    }, 3000);
  };

  pokemon.initColorCicleUI = () => {
    circleCanvas = drawCircleOnCanvas(_playerNumber);

    const position = rgb2xy(
      pokemon.stats.colors.r,
      pokemon.stats.colors.g,
      pokemon.stats.colors.b
    );

    indicator.style.left = circleCanvas.offsetLeft - 4 - position.x + 50 + "px";
    indicator.style.top = circleCanvas.offsetTop - position.y + 50 + "px";
  };

  pokemon.init = (_opponent) => {
    pokemon.opponent = _opponent;
    pokemon.initAttackUI();

    pokemon.initColorCicleUI();
  };

  pokemon.update = () => {
    pokemon.childrenObjects.forEach((children, index, arr) => {
      if (children.state.dead == true) {
        arr.splice(index, 1);
        pokemon.mesh.remove(children._pivot);
      } else {
        children.update();
      }
    });

    pokemon.mesh.update();

    if (
      gameProps.state.playerTurn[_playerNumber - 1] &&
      !gameProps.state.playerDone[_playerNumber - 1]
    ) {
      attacksMenu.style.display = "flex";
      pokemon.updateIndicator();

      if (pokemon.state.isBot) {
        let attackNumber = 0;

        if (pokemon.childrenObjects.length) {
          attackNumber = Math.floor(
            Math.random() * playerStats[_playerNumber - 1].attacks.length
          );
        } else {
          attackNumber = Math.floor(Math.random() * 3);
        }
        pokemon.startAttack(
          playerStats[_playerNumber - 1].attacks[attackNumber]
        );
      }
    }
  };

  return pokemon;
}
