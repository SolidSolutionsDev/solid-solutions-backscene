import * as THREE from "three";

export function addCylinder(_transform) {
  let cyls = [];
  let pMesh;
  let cylinder = {};

  cylinder.mesh = _transform;

  cylinder.initGeometry = () => {
    let cylCount = 25;
    let cylHeight = 0.1;
    let cylSpacing = cylHeight / 2;

    for (let i = 0; i < cylCount; i++) {
      let geo = new THREE.CylinderGeometry(1, 1, cylHeight, 5);
      let mat = new THREE.MeshNormalMaterial();
      let cyl = new THREE.Mesh(geo, mat);
      cyl.position.y = i * (cylHeight + cylSpacing);
      cyl.rotation.y = i / 20;
      cyls.push(cyl);
      cylinder.mesh.add(cyl);
    }

    // create particles
    let ps = [];
    let psCount = 300;
    const pGeo = new THREE.Geometry();
    for (let i = 0; i < psCount; i++) {
      let p = {
        position: new THREE.Vector3(
          Math.random() * 4 - 2,
          Math.random() * 3.5,
          Math.random() * 4 - 2
        ),
      };

      ps.push(p);
      pGeo.vertices.push(p.position);
    }
    const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    pMesh = new THREE.Points(pGeo, pMat);
    cylinder.mesh.add(pMesh);
  };

  cylinder.initGeometry();

  cylinder.update = () => {
    cyls.forEach((cyl) => {
      cyl.rotation.y += 0.01;
      pMesh.rotation.y -= 0.001;
    });
  };

  return cylinder;
}
