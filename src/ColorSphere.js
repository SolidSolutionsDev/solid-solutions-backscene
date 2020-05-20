import * as THREE from "three";
import { reparentObject3D } from "./Utils/utils";
import { sphereOptions } from "./states";

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
      sphere.state.exploding = true;
    }

    if (sphere.mesh.position.y > +error) {
      sphere.mesh.position.y -= speed2target.y;
    } else if (sphere.mesh.position.y < -error) {
      sphere.mesh.position.y += speed2target.y;
    } else {
      sphere.state.exploding = true;
    }

    if (sphere.mesh.position.z > +error) {
      sphere.mesh.position.z -= speed2target.z;
    } else if (sphere.mesh.position.z < -error) {
      sphere.mesh.position.z += speed2target.z;
    } else {
      sphere.state.exploding = true;
    }
  };
}
