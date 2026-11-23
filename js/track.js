(function () {
  const C = window.GameConstants;

  function createTrack(scene) {
    const group = new THREE.Group();

    const groundGeo = new THREE.PlaneGeometry(40, 1200);
    const groundMat = new THREE.MeshLambertMaterial({ color: C.palette.grass });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.02, -450);
    ground.receiveShadow = false;
    group.add(ground);

    const trackGeo = new THREE.PlaneGeometry(C.track.width, 1200);
    const trackMat = new THREE.MeshLambertMaterial({ color: C.palette.track });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.set(0, 0, -450);
    group.add(track);

    const markings = [];
    const markGeo = new THREE.BoxGeometry(0.12, 0.02, 1.8);
    const markMat = new THREE.MeshLambertMaterial({ color: C.palette.laneMark });
    for (let z = 8; z > -C.track.length; z -= C.track.segmentSpacing) {
      for (let i = 0; i < C.lanes.length - 1; i++) {
        const x = (C.lanes[i] + C.lanes[i + 1]) / 2;
        const mark = new THREE.Mesh(markGeo, markMat);
        mark.position.set(x, 0.02, z);
        group.add(mark);
        markings.push(mark);
      }
    }

    const scenery = [];
    const treeTrunkGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.8, 6);
    const treeTrunkMat = new THREE.MeshLambertMaterial({ color: C.palette.fireplaceMaroon });
    const treeLeafGeo = new THREE.SphereGeometry(0.55, 8, 8);
    const treeLeafMat = new THREE.MeshLambertMaterial({ color: C.palette.forestGreen });
    const bushGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const bushMat = new THREE.MeshLambertMaterial({ color: C.palette.mutedOrange });
    for (let z = 6; z > -C.track.length; z -= C.track.scenerySpacing) {
      [-1, 1].forEach(function (side, idx) {
        const x = side * (4.9 + (idx % 2) * 0.5);
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
        trunk.position.y = 0.4;
        const leaves = new THREE.Mesh(treeLeafGeo, treeLeafMat);
        leaves.position.y = 1.05;
        tree.add(trunk);
        tree.add(leaves);
        tree.position.set(x, 0, z - (idx * 1.5));
        group.add(tree);
        scenery.push(tree);

        const bush = new THREE.Mesh(bushGeo, idx % 2 === 0 ? bushMat : new THREE.MeshLambertMaterial({ color: C.palette.sunshineYellow }));
        bush.position.set(x - side * 0.9, 0.25, z - 2.2);
        group.add(bush);
        scenery.push(bush);
      });
    }

    scene.add(group);
    return { group: group, markings: markings, scenery: scenery };
  }

  function recycleObjects(objects, speed, delta, minZ, maxZ) {
    const dz = speed * delta;
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      obj.position.z += dz;
      if (obj.position.z > maxZ) {
        obj.position.z -= (maxZ - minZ);
      }
    }
  }

  window.Track = {
    init: function (scene) {
      this._data = createTrack(scene);
    },
    update: function (delta, speed) {
      if (!this._data) return;
      recycleObjects(this._data.markings, speed, delta, -150, 12);
      recycleObjects(this._data.scenery, speed, delta, -150, 12);
    },
    reset: function () {
      if (!this._data) return;
      // Positions are already distributed; recycling keeps continuity. No hard reset needed.
    }
  };
})();
