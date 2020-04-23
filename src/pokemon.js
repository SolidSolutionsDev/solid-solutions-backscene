import THREE from "three";

const pokeTypes = [
  {
    type: "red",
    r: 100,
    g: 0,
    b: 255,
  },
  {
    type: "green",
    r: 0,
    g: 100,
    b: 240,
  },
];

const combatPositions = [
  {
    player: "one",
    position: {
      x: -5,
      y: -3,
      z: 25,
    },
    rotation: {
      x: 0.1,
      y: -0.4,
      z: 0.3,
    },
    attacks: [
      { type: "green", damage: { r: 0, g: 20, b: 0 } },
      { type: "blue", damage: { r: 0, g: 0, b: 40 } },
    ],
  },
  {
    player: "two",
    position: {
      x: 8,
      y: 4,
      z: 10,
    },
    rotation: {
      x: 0.1,
      y: -0.4,
      z: 0.3,
    },
    attacks: [
      { type: "red", damage: { r: 40, g: 0, b: 0 } },
      { type: "purple", damage: { r: 20, g: 0, b: 20 } },
    ],
  },
];

export const Pokemon = (_playerNumber) => {
  let playerNumber = _playerNumber;
  let stats = {
    animating: false,
    myTurn: true,
    colors: {
      r: pokeTypes[playerNumber - 1].r,
      g: pokeTypes[playerNumber - 1].g,
      b: pokeTypes[playerNumber - 1].b,
    },
  };

  let startingColor = new THREE.Color(
    `rgb(${stats.colors.r}, ${stats.colors.g}, ${stats.colors.b})`
  );

  let geometry = new THREE.BoxGeometry(2, 3, 3);
  let material = new THREE.MeshBasicMaterial({ color: startingColor });
  let poke = new THREE.Mesh(geometry, material);

  let geo = new THREE.EdgesGeometry(poke.geometry); // or WireframeGeometry
  let mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
  let pokeWireframe = new THREE.LineSegments(geo, mat);

  let geom = new THREE.CircleGeometry(5, 32);
  let mate = new THREE.MeshBasicMaterial({ color: 0x666666 });
  let circle = new THREE.Mesh(geom, mate);

  poke.add(circle);
  poke.add(pokeWireframe);

  circle.rotation.set(-1.3, 0, 0);
  circle.position.set(0, -2, 0);

  poke.position.set(
    combatPositions[playerNumber - 1].position.x,
    combatPositions[playerNumber - 1].position.y,
    combatPositions[playerNumber - 1].position.z
  );
  poke.rotation.set(
    combatPositions[playerNumber - 1].rotation.x,
    combatPositions[playerNumber - 1].rotation.y,
    combatPositions[playerNumber - 1].rotation.z
  );

  let palette = initPalette(playerNumber);

  //set new color
  const addColor = (colorDamage) => {
    console.log("chamou");
    stats.colors = {
      r:
        stats.colors.r - colorDamage.r < 0 ? 0 : stats.colors.r - colorDamage.r,
      g:
        stats.colors.g - colorDamage.g < 0 ? 0 : stats.colors.g - colorDamage.g,
      b:
        stats.colors.b - colorDamage.b < 0 ? 0 : stats.colors.b - colorDamage.b,
    };

    let newColor = new THREE.Color(
      `rgb(${stats.colors.r}, ${stats.colors.g}, ${stats.colors.b})`
    );

    poke.material.color.set(newColor);
  };

  const initAttackUI = (takeDamage) => {
    let menu = document.getElementById(`player${playerNumber}_Label`);
    combatPositions[playerNumber - 1].attacks.forEach((attack) => {
      let attackBtn = document.createElement("BUTTON");
      attackBtn.innerHTML = attack.type;
      attackBtn.id = "btn";
      attackBtn.onclick = () => {
        takeDamage(attack.damage);
      };
      menu.appendChild(attackBtn);
    });
  };

  return { poke, stats, addColor, initAttackUI };
};

const initPalette = (playerNumber) => {
  var app = {};

  app.canvas = document.getElementById(`color-palette_${playerNumber}`);
  app.colorctx = app.canvas.getContext("2d");

  // Build Color palette
  app.buildColorPalette = function () {
    var gradient = app.colorctx.createLinearGradient(
      0,
      0,
      app.colorctx.canvas.width,
      0
    );

    // Create color gradient
    gradient.addColorStop(0, "rgb(255,   0,   0)");
    gradient.addColorStop(0.15, "rgb(255,   0, 255)");
    gradient.addColorStop(0.33, "rgb(0,     0, 255)");
    gradient.addColorStop(0.49, "rgb(0,   255, 255)");
    gradient.addColorStop(0.67, "rgb(0,   255,   0)");
    gradient.addColorStop(0.84, "rgb(255, 255,   0)");
    gradient.addColorStop(1, "rgb(255,   0,   0)");

    // Apply gradient to canvas
    app.colorctx.fillStyle = gradient;
    app.colorctx.fillRect(
      0,
      0,
      app.colorctx.canvas.width,
      app.colorctx.canvas.height
    );
  };

  app.buildColorPalette();

  return app;
};
