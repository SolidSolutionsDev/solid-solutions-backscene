import THREE from "three";

const pokeTypes = [
  {
    type: "red",
    r: 255,
    g: 0,
    b: 0,
  },
  {
    type: "green",
    r: 0,
    g: 255,
    b: 0,
  },
];

export const Pokemon = (playerNumber) => {
  let stats = {
    animating: false,
    dead: false,
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

  poke.add(pokeWireframe);

  if (playerNumber == 1) {
    poke.position.set(-5, -3, 25);
  }

  if (playerNumber == 2) {
    poke.position.set(8, 4, 10);
    poke.rotation.set(0.3, -0.4, 0.1);
  }

  let palette = initPalette(playerNumber);

  //set new color
  const addColor = (colorDamage) => {
    stats.colors = {
      r: stats.colors.r + colorDamage.r,
      g: stats.colors.g + colorDamage.g,
      b: stats.colors.b + colorDamage.b,
    };

    let newColor = new THREE.Color(
      `rgb(${stats.colors.r}, ${stats.colors.g}, ${stats.colors.b})`
    );

    poke.material.color.set(newColor);
  };

  return { poke, stats, addColor };
};

const initPalette = (playerNumber) => {
  var app = {};
  app.canvas = document.getElementById(`color-palette_${playerNumber}`);
  app.colorctx = app.canvas.getContext("2d");

  console.log("RUI", app.colorctx);

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
