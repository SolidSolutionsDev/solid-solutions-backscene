import THREE from "three";

const pokeTypes = [
  {
    type: "red",
    r: 255,
    g: 255,
    b: 255,
  },
  {
    type: "green",
    r: 255,
    g: 255,
    b: 255,
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
      { type: "green", damage: { r: 0, g: 20, b: 0 } },
    ],
  },
];

export function Pokemon(_playerNumber) {
  let playerNumber = _playerNumber;
  let indicator = document.getElementById("indicator");
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

  initPalette(playerNumber);

  //set new color
  const addColor = (colorDamage) => {
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

    const position = rgb2xy(stats.colors.r, stats.colors.g, stats.colors.b);
    console.log(position[0], position[1]);

    indicator.style.left = -position[0] + 50 + "px";
    indicator.style.top = -position[1] + 50 + "px";
    //DEBUG
    // let rgb = [colorDamage.r, colorDamage.g, colorDamage.b];
    // let hsv = rgb2hsv(rgb[0], rgb[1], rgb[2]);
    // console.log(rgb, hsv, hsv.h, hsv2rgb(hsv.h, hsv.s / 100, hsv.v / 100));

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
  drawCircleOnCanvas();
  return { poke, stats, addColor, initAttackUI };
}

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

const rgb2xy = (r, g, b) => {
  let radius = 50;

  let hsv = rgb2hsv(r, g, b);

  let theta = deg2rad(hsv.h);

  let distance2center = (hsv.s / 100) * radius;

  // console.log(
  //   "hsv: ",
  //   hsv,
  //   "theta: " + theta,
  //   "distance2center: " + distance2center
  // );

  let position = polar2xy(distance2center, theta).map((coord) =>
    Math.floor(coord)
  );

  return position;
};

const drawCircleOnCanvas = () => {
  let circleCanvas = document.getElementById("circularCanvas");
  let ctx = circleCanvas.getContext("2d");

  function drawCircle() {
    let radius = 50;
    let image = ctx.createImageData(2 * radius, 2 * radius);
    let data = image.data;

    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {
        let [r, phi] = xy2polar(x, y);

        if (r > radius) {
          // skip all (x,y) coordinates that are outside of the circle
          continue;
        }

        let deg = rad2deg(phi);

        // Figure out the starting index of this pixel in the image data array.
        let rowLength = 2 * radius;
        let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let pixelWidth = 4; // each pixel requires 4 slots in the data array
        let index = (adjustedX + adjustedY * rowLength) * pixelWidth;

        let hue = deg;
        let saturation = r / radius;
        let value = 1.0;

        let [red, green, blue] = hsv2rgb(hue, saturation, value);

        // console.log(
        //   "Position",
        //   rgb2xy(
        //     hsv2rgb(hue, saturation, value)[0],
        //     hsv2rgb(hue, saturation, value)[1],
        //     hsv2rgb(hue, saturation, value)[2]
        //   ),
        //   "X: " + x,
        //   "Y: " + y
        // );

        let alpha = 255;

        data[index] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = alpha;
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  function xy2polar(x, y) {
    let r = Math.sqrt(x * x + y * y);
    let phi = Math.atan2(y, x);
    return [r, phi];
  }

  // rad in [-π, π] range
  // return degree in [0, 360] range
  function rad2deg(rad) {
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
  }

  drawCircle();
};

//degrees
function deg2rad(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

//distance to center, theta in radians
function polar2xy(distance, theta) {
  // Convert polar to cartesian
  let x = distance * Math.cos(theta);
  let y = distance * Math.sin(theta);
  return [x, y];
}

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
// See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
function hsv2rgb(hue, saturation, value) {
  let chroma = value * saturation;
  let hue1 = hue / 60;
  let x = chroma * (1 - Math.abs((hue1 % 2) - 1));
  let r1, g1, b1;
  if (hue1 >= 0 && hue1 <= 1) {
    [r1, g1, b1] = [chroma, x, 0];
  } else if (hue1 >= 1 && hue1 <= 2) {
    [r1, g1, b1] = [x, chroma, 0];
  } else if (hue1 >= 2 && hue1 <= 3) {
    [r1, g1, b1] = [0, chroma, x];
  } else if (hue1 >= 3 && hue1 <= 4) {
    [r1, g1, b1] = [0, x, chroma];
  } else if (hue1 >= 4 && hue1 <= 5) {
    [r1, g1, b1] = [x, 0, chroma];
  } else if (hue1 >= 5 && hue1 <= 6) {
    [r1, g1, b1] = [chroma, 0, x];
  }

  let m = value - chroma;
  let [r, g, b] = [r1 + m, g1 + m, b1 + m];
  return [255 * r, 255 * g, 255 * b];
}

function rgb2hsv(r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
  diffc = (c) => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = (num) => Math.round(num * 100) / 100;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100),
  };
}
