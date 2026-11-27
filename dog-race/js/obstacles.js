(function () {
  const C = window.GameConstants;

  function createObstacleMesh(type) {
    const group = new THREE.Group();
    if (type === "cone") {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 0.8, 8),
        new THREE.MeshLambertMaterial({ color: C.palette.cone })
      );
      cone.position.y = 0.4;
      group.add(cone);
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.28, 0.16, 8),
        new THREE.MeshLambertMaterial({ color: C.palette.cream })
      );
      stripe.position.y = 0.38;
      group.add(stripe);
      group.userData.radiusZ = 0.35;
      group.userData.radiusX = 0.35;
    } else if (type === "puddle") {
      const puddle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.65, 0.06, 16),
        new THREE.MeshLambertMaterial({ color: C.palette.puddle, transparent: true, opacity: 0.85 })
      );
      puddle.position.y = 0.03;
      group.add(puddle);
      group.userData.radiusZ = 0.55;
      group.userData.radiusX = 0.55;
    } else { // hay
      const bale = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.5, 0.55),
        new THREE.MeshLambertMaterial({ color: C.palette.hay })
      );
      bale.position.y = 0.25;
      group.add(bale);
      const bandMat = new THREE.MeshLambertMaterial({ color: C.palette.mutedOrange });
      const band1 = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.52, 0.08), bandMat);
      band1.position.set(0, 0.25, -0.12);
      const band2 = band1.clone();
      band2.position.z = 0.12;
      group.add(band1); group.add(band2);
      group.userData.radiusZ = 0.35;
      group.userData.radiusX = 0.45;
    }
    return group;
  }

  function createBone() {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: C.palette.bone });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 8), mat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.y = 0.7;
    group.add(shaft);
    const knobGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const positions = [[-0.75, 0.82], [-0.75, 0.58], [0.75, 0.82], [0.75, 0.58]];
    positions.forEach(function (p) {
      const k = new THREE.Mesh(knobGeo, mat);
      k.position.set(p[0], p[1], 0);
      group.add(k);
    });
    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.05, 8, 24),
      new THREE.MeshLambertMaterial({ color: C.palette.sunshineYellow })
    );
    glow.rotation.x = Math.PI / 2;
    glow.position.y = 0.7;
    group.add(glow);
    group.userData.isBone = true;
    group.userData.radiusZ = 0.7;
    group.userData.radiusX = 0.9;
    return group;
  }

  window.Obstacles = {
    init: function (scene) {
      this.scene = scene;
      this.items = [];
      this.bone = null;
      this.spawnTimer = 0;
      this.distanceSinceSpawn = 0;
    },

    reset: function () {
      for (let i = 0; i < this.items.length; i++) this.scene.remove(this.items[i]);
      this.items = [];
      if (this.bone) { this.scene.remove(this.bone); this.bone = null; }
      this.spawnTimer = 0;
    },

    spawnForLevel: function (level, levelDistance) {
      this.reset();
      this.levelDistance = levelDistance;
        // Bone placed so it reaches the player after traveling levelDistance
      this.bone = createBone();
        this.bone.position.set(C.lanes[1], 0, C.playerZ - levelDistance);
      this.bone.userData.laneIndex = 1;
      this.scene.add(this.bone);
    },

    trySpawnObstacle: function (delta, speed, level) {
      this.spawnTimer -= delta;
      const interval = Math.max(C.level.minObstacleInterval, C.level.baseObstacleInterval - (level - 1) * C.level.obstacleIntervalDecay);
      const maxObstacles = C.level.baseMaxObstacles + (level - 1) * C.level.maxObstaclesPerLevel;
      if (this.spawnTimer > 0) return;
      if (this.items.length >= maxObstacles) { this.spawnTimer = interval * 0.5; return; }

      const type = C.obstacleTypes[Math.floor(Math.random() * C.obstacleTypes.length)];
      const laneIndex = Math.floor(Math.random() * C.lanes.length);
      // avoid spawning too close to bone or overlapping recent obstacles
      const spawnZ = -70 - Math.random() * 35;
      if (this.bone && Math.abs(spawnZ - this.bone.position.z) < 10) {
        this.spawnTimer = 0.25;
        return;
      }
      for (let i = 0; i < this.items.length; i++) {
        const it = this.items[i];
        if (it.userData.laneIndex === laneIndex && Math.abs(it.position.z - spawnZ) < 8) {
          this.spawnTimer = 0.2;
          return;
        }
      }
      const mesh = createObstacleMesh(type);
      mesh.position.set(C.lanes[laneIndex], 0, spawnZ);
      mesh.userData.laneIndex = laneIndex;
      mesh.userData.type = type;
      this.scene.add(mesh);
      this.items.push(mesh);
      this.spawnTimer = interval * (0.8 + Math.random() * 0.5);
    },

    update: function (delta, speed, level) {
      this.trySpawnObstacle(delta, speed, level);
      const dz = speed * delta;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.position.z += dz;
        if (item.position.z > 12) {
          this.scene.remove(item);
          this.items.splice(i, 1);
        }
      }
      if (this.bone) {
        this.bone.position.z += dz;
        this.bone.rotation.y += delta * 1.8;
        const glow = this.bone.children[this.bone.children.length - 1];
        if (glow) glow.rotation.z += delta * 2.5;
      }
    },

    checkCollisions: function (player) {
      const pz = player.getPosition().z;
      const lane = player.getLaneIndex();
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (item.userData.laneIndex !== lane) continue;
        const dz = Math.abs(item.position.z - pz);
        const hitZ = (item.userData.radiusZ || 0.4) + 0.45;
        if (dz < hitZ) {
          this.scene.remove(item);
          this.items.splice(i, 1);
          return { hit: true, type: item.userData.type };
        }
      }
      return { hit: false };
    },

    checkBoneReached: function (player) {
      if (!this.bone) return false;
      const pz = player.getPosition().z;
      const dz = Math.abs(this.bone.position.z - pz);
      const dx = Math.abs(this.bone.position.x - player.getPosition().x);
      return dz < 1.2 && dx < 1.6;
    },

    getBone: function () { return this.bone; }
  };
})();
