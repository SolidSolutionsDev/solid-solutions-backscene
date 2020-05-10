import THREE from "three";

const awesomeLines = [
  "Awesome! Just awesome.",
  "Sincerely, I was not expecting that...",
  "Things are just starting to warm up.",
  "I think he will be back!",
  "Just another ordinary day at the park",
];

const sphereOptions = {
  colors: [
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 255, b: 25 },
  ],
  startingSize: 0.2,
};

const pokeList = [
  {
    name: "Blue White Mouse",
    frontAsset: "../../images/solid1_front_nb_s.gif",
    backAsset: "../../images/solid1_back_nb_s.gif",
    initColor: {
      r: 200,
      g: 200,
      b: 40,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
  {
    name: "White Grey Mouse",
    frontAsset: "../../images/solid1_front_nb_s.gif",
    backAsset: "../../images/solid1_back_nb_s.gif",
    initColor: {
      r: 200,
      g: 200,
      b: 40,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
];

const playerStats = [
  {
    name: "Blue White Mouse",
    isBot: false,
    initColor: {
      r: 200,
      g: 200,
      b: 40,
    },
    position: {
      x: -3,
      y: -2,
      z: 25,
    },
    rotation: {
      x: 0.1,
      y: -0.4,
      z: 0.4,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
  {
    name: "BEAUTIFUL CUBE",
    isBot: true,
    initColor: {
      r: 40,
      g: 200,
      b: 40,
    },
    position: {
      x: 6,
      y: 6,
      z: 10,
    },
    rotation: {
      x: 0.3,
      y: -0.4,
      z: 0.3,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
];

export function addPokemon(_playerNumber, gameProps) {
  let pokemon = {};

  let playerNumber = _playerNumber;

  pokemon.state = {
    init: false,
    animating: false,
    playerNumber: playerNumber,
    myTurn: true,
    isBot: playerStats[playerNumber - 1].isBot,
  };

  let attacksMenu, indicator, circleCanvas;
  pokemon.childrenObjects = [];

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

  let startingColor = new THREE.Color(
    `rgb(${pokemon.stats.colors.r}, ${pokemon.stats.colors.g}, ${pokemon.stats.colors.b})`
  );

  pokemon.mesh = pokemon.createCubeMesh(startingColor);

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
      `rgb(${pokemon.stats.colors.r}, ${pokemon.stats.colors.g}, ${pokemon.stats.colors.b})`
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

    indicator.style.left = circleCanvas.offsetLeft - 4 - position.x + 50 + "px";
    indicator.style.top = circleCanvas.offsetTop - position.y + 50 + "px";
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

    if (
      gameProps.state.playerTurn[_playerNumber - 1] &&
      !gameProps.state.playerDone[_playerNumber - 1]
    ) {
      attacksMenu.style.display = "flex";
      pokemon.updateIndicator();

      if (pokemon.state.isBot) {
        console.log("im a bot and i will attack");
        let attackNumber = 0;

        console.log("Size ", pokemon.childrenObjects.length);

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

export function addColorSphere(_parent, color) {
  let sphere = {
    state: {
      initing: true,
      rotating: true,
      attacking: false,
      exploding: false,
      dead: false,
    },
    stats: {
      size: sphereOptions.startingSize,
      currentSize: sphereOptions.startingSize,
    },
  };
  let speed2target = {};
  let _color = color ? color : { r: 100, g: 100, b: 100 };

  // Box
  let geometry = new THREE.SphereGeometry(1, 32, 32);
  let sphereColor = new THREE.Color(
    `rgb(${_color.r}, ${_color.g}, ${_color.b})`
  );
  let material = new THREE.MeshBasicMaterial({ color: sphereColor });

  sphere.mesh = new THREE.Mesh(geometry, material);

  sphere.mesh.scale.set(
    sphere.stats.size,
    sphere.stats.size,
    sphere.stats.size
  );

  sphere.mesh.position.set(0, 0, 0);

  sphere._pivot = new THREE.Group();
  sphere._pivot.add(sphere.mesh);
  _parent.mesh.add(sphere._pivot);

  _parent.childrenObjects.push(sphere);

  sphere.update = () => {
    if (sphere.state.dead) {
      return;
    }

    if (sphere.stats.size > sphere.stats.currentSize) {
      console.log(sphere.stats.size, sphere.stats.currentSize);
      sphere.stats.currentSize += 0.01;
      sphere.mesh.scale.set(
        sphere.stats.currentSize,
        sphere.stats.currentSize,
        sphere.stats.currentSize
      );
    }

    if (sphere.state.initing && sphere.mesh.position.z < 4) {
      sphere.mesh.position.z += 0.1;
    } else {
      sphere.state.initing = false;
    }

    if (sphere.state.rotating && !sphere.state.attacking) {
      sphere._pivot.rotation.y += 0.1;
    } else if (sphere.state.attacking && !sphere.state.exploding) {
      sphere.move(0.5);
    }

    if (sphere.state.exploding) {
      _parent.opponent.addColor({
        r: _color.r * sphere.stats.size,
        g: _color.g * sphere.stats.size,
        b: _color.b * sphere.stats.size,
      });
      console.log("Color added: ", {
        r: _color.r * sphere.stats.size,
        g: _color.g * sphere.stats.size,
        b: _color.b * sphere.stats.size,
      });
      sphere.state.dead = true;
    }
  };

  sphere.move = (speedIndex) => {
    let error = 0.01;
    reparentObject3D(sphere.mesh, _parent.opponent.mesh);

    if (!speed2target.x) {
      let max = Math.max(
        Math.abs(sphere.mesh.position.x),
        Math.abs(sphere.mesh.position.y),
        Math.abs(sphere.mesh.position.z)
      );
      speed2target.x = (Math.abs(sphere.mesh.position.x) * speedIndex) / max;
      speed2target.y = (Math.abs(sphere.mesh.position.y) * speedIndex) / max;
      speed2target.z = (Math.abs(sphere.mesh.position.z) * speedIndex) / max;
    }

    if (sphere.mesh.position.x > error) {
      sphere.mesh.position.x -= speed2target.x;
    } else if (sphere.mesh.position.x < -error) {
      sphere.mesh.position.x += speed2target.x;
    } else {
      console.log("collidded in x");
      sphere.state.exploding = true;
    }

    if (sphere.mesh.position.y > +error) {
      sphere.mesh.position.y -= speed2target.y;
    } else if (sphere.mesh.position.y < -error) {
      sphere.mesh.position.y += speed2target.y;
    } else {
      console.log("collidded in y");
      sphere.state.exploding = true;
    }

    if (sphere.mesh.position.z > +error) {
      sphere.mesh.position.z -= speed2target.z;
    } else if (sphere.mesh.position.z < -error) {
      sphere.mesh.position.z += speed2target.z;
    } else {
      console.log("collidded in z");
      sphere.state.exploding = true;
    }
  };
}

function reparentObject3D(subject, newParent) {
  subject.matrix.copy(subject.matrixWorld);
  subject.applyMatrix(new THREE.Matrix4().getInverse(newParent.matrixWorld));
  newParent.add(subject);
}

const drawCircleOnCanvas = (_playerNumber) => {
  let circleCanvas = document.getElementById(
    `slot${_playerNumber}_colorCanvas`
  );
  let ctx = circleCanvas.getContext("2d");

  function drawCircle() {
    let radius = 50;
    let image = ctx.createImageData(2 * radius, 2 * radius);
    let data = image.data;
    let rowLength = 2 * radius;
    let pixelWidth = 4; // each pixel requires 4 slots in the data array

    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {
        let [r, phi] = xy2polar(x, y);

        if (r > radius) {
          // skip all (x,y) coordinates that are outside of the circle
          continue;
        }

        let deg = rad2deg(phi);

        // Figure out the starting index of this pixel in the image data array.
        let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)

        let index = (adjustedX + adjustedY * rowLength) * pixelWidth;

        let hue = deg;
        let saturation = r / radius;
        let value = 1.0;

        let [red, green, blue] = hsv2rgb(hue, saturation, value);

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

  return circleCanvas;
};

// [0,255] to [00, FF]
const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

//rgb color to hexa color (e.g. #002F02)
const rgbToHex = (color) => {
  return (
    "#" +
    componentToHex(color.r) +
    componentToHex(color.g) +
    componentToHex(color.b)
  );
};

//rgb color to 2D position
const rgb2xy = (r, g, b) => {
  let radius = 50;

  let hsv = rgb2hsv(r, g, b);

  let theta = deg2rad(hsv.h);

  let distance2center = hsv.s * radius;

  // console.log(
  //   "hsv: ",
  //   hsv,
  //   "theta: " + theta,
  //   "distance2center: " + distance2center
  // );

  let position = polar2xy(distance2center, theta);

  return { x: Math.floor(position.x), y: Math.floor(position.y) };
};

//degrees to radians
function deg2rad(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

//distance to center, theta in radians
//return {x:, y:}
function polar2xy(distance, theta) {
  // Convert polar to cartesian
  let posX = distance * Math.cos(theta);
  let posY = distance * Math.sin(theta);
  return { x: posX, y: posY };
}

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
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

// r,g,b in range [0, 255]
// return {h: deg ,s: [0, 1],v: [0, 1]}
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
    s: percentRoundFn(s),
    v: percentRoundFn(v),
  };
}
