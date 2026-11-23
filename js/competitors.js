(function () {
  const C = window.GameConstants;

  function createAnimal(colorMain, colorAlt, kind) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.45, 1.0),
      new THREE.MeshLambertMaterial({ color: colorMain })
    );
    body.position.y = 0.55;
    group.add(body);
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.4, 0.45),
      new THREE.MeshLambertMaterial({ color: colorMain })
    );
    head.position.set(0, 0.9, -0.45);
    group.add(head);

    if (kind === "cat") {
      const earGeo = new THREE.ConeGeometry(0.1, 0.22, 4);
      const earMat = new THREE.MeshLambertMaterial({ color: colorAlt });
      const e1 = new THREE.Mesh(earGeo, earMat); e1.position.set(-0.14, 1.15, -0.45);
      const e2 = e1.clone(); e2.position.x = 0.14;
      group.add(e1); group.add(e2);
    } else if (kind === "bunny") {
      const earGeo = new THREE.BoxGeometry(0.1, 0.35, 0.1);
      const earMat = new THREE.MeshLambertMaterial({ color: colorAlt });
      const e1 = new THREE.Mesh(earGeo, earMat); e1.position.set(-0.12, 1.2, -0.45);
      const e2 = e1.clone(); e2.position.x = 0.12;
      group.add(e1); group.add(e2);
    } else {
      const earGeo = new THREE.SphereGeometry(0.12, 6, 6);
      const earMat = new THREE.MeshLambertMaterial({ color: colorAlt });
      const e1 = new THREE.Mesh(earGeo, earMat); e1.position.set(-0.18, 1.05, -0.4);
      const e2 = e1.clone(); e2.position.x = 0.18;
      group.add(e1); group.add(e2);
    }

    const snout = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.16, 0.18),
      new THREE.MeshLambertMaterial({ color: C.palette.cream })
    );
    snout.position.set(0, 0.82, -0.72);
    group.add(snout);

    const legs = [];
    const legGeo = new THREE.BoxGeometry(0.12, 0.3, 0.12);
    const legMat = new THREE.MeshLambertMaterial({ color: colorAlt });
    const lp = [[-0.22,0.15,-0.28],[0.22,0.15,-0.28],[-0.22,0.15,0.28],[0.22,0.15,0.28]];
    lp.forEach(function (p) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(p[0], p[1], p[2]);
      group.add(leg);
      legs.push(leg);
    });

    group.userData.legs = legs;
    group.userData.animTime = Math.random() * Math.PI * 2;
    group.userData.baseX = 0;
    group.userData.lateralPhase = Math.random() * Math.PI * 2;
    return group;
  }

  window.Competitors = {
    init: function (scene) {
      this.scene = scene;
      this.items = [];
      const kinds = ["cat", "bunny", "bear", "fox"];
      const laneChoices = [0, 2, 0, 2];
      for (let i = 0; i < C.competitors.count; i++) {
        const colorMain = C.colorsByCompetitor[i % C.colorsByCompetitor.length];
        const colorAlt = i % 2 === 0 ? C.palette.mutedOrange : C.palette.sunshineYellow;
        const animal = createAnimal(colorMain, colorAlt, kinds[i % kinds.length]);
        const lane = laneChoices[i % laneChoices.length];
        const z = C.competitors.zMin + (i * 1.4) % (C.competitors.zMax - C.competitors.zMin);
        animal.position.set(C.lanes[lane] + (i === 1 ? 0.3 : -0.2), 0, z);
        animal.userData.baseX = animal.position.x;
        animal.userData.speedFactor = C.competitors.speedFactorMin + Math.random() * (C.competitors.speedFactorMax - C.competitors.speedFactorMin);
        animal.userData.lane = lane;
        scene.add(animal);
        this.items.push(animal);
      }
    },

    reset: function (level) {
      const levelBoost = 1 + (level - 1) * 0.03;
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const z = C.competitors.zMin + (i * 1.6) % (C.competitors.zMax - C.competitors.zMin);
        item.position.z = z;
        item.userData.animTime = Math.random() * Math.PI * 2;
        item.userData.speedFactor = (C.competitors.speedFactorMin + Math.random() * (C.competitors.speedFactorMax - C.competitors.speedFactorMin)) * levelBoost;
      }
    },

    update: function (delta, worldSpeed, level) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
          // Visual-only racers: move with the world flow plus slight personal variation so they appear to run alongside.
          const personalSpeed = worldSpeed * item.userData.speedFactor;
          item.position.z += personalSpeed * delta;

          // Keep racers in a visible band around the player.
          var minZ = C.competitors.zMin - 2.5;
          var maxZ = C.competitors.zMax + 2.5;
          if (item.position.z > maxZ) {
            item.position.z = minZ + (item.position.z - maxZ);
            item.userData.speedFactor = C.competitors.speedFactorMin + Math.random() * (C.competitors.speedFactorMax - C.competitors.speedFactorMin) * (1 + (level - 1) * 0.03);
          } else if (item.position.z < minZ) {
            item.position.z = maxZ - (minZ - item.position.z);
          }

        item.userData.lateralPhase += delta * 0.8;
        item.position.x = item.userData.baseX + Math.sin(item.userData.lateralPhase) * C.competitors.lateralAmplitude;

          item.userData.animTime += delta * (8 + personalSpeed * 0.25);
          var bounce = Math.sin(item.userData.animTime) * 0.04;
        item.position.y = Math.max(0, bounce);
          var swing = Math.sin(item.userData.animTime) * 0.5;
          var legs = item.userData.legs || [];
          for (var j = 0; j < legs.length; j++) {
            var phase = (j === 0 || j === 3) ? swing : -swing;
          legs[j].rotation.x = phase;
        }
      }
    }
  };
})();
