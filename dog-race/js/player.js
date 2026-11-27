(function () {
  const C = window.GameConstants;

  function makeLimb(w, h, d, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ color: color })
    );
    return mesh;
  }

  window.Player = {
    init: function (scene) {
      this.scene = scene;
      this.group = new THREE.Group();
      this.laneIndex = 1;
      this.targetX = C.lanes[this.laneIndex];
      this.group.position.set(this.targetX, 0, C.playerZ);
      this.runTime = 0;
      this.hitTimer = 0;
      this.invulnTimer = 0;
      this.flashTimer = 0;
      this.slowFactor = 1;

      const bodyMat = new THREE.MeshLambertMaterial({ color: C.palette.dog });
      const darkMat = new THREE.MeshLambertMaterial({ color: C.palette.dogDark });
      const creamMat = new THREE.MeshLambertMaterial({ color: C.palette.cream });
      const maroonMat = new THREE.MeshLambertMaterial({ color: C.palette.fireplaceMaroon });

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 1.2), bodyMat);
      body.position.set(0, 0.7, 0);
      this.group.add(body);
      this.body = body;

      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.35), creamMat);
      chest.position.set(0, 0.55, -0.45);
      this.group.add(chest);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.55), bodyMat);
      head.position.set(0, 1.1, -0.55);
      this.group.add(head);

      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.25), creamMat);
      snout.position.set(0, 1.0, -0.88);
      this.group.add(snout);

      const nose = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.05), maroonMat);
      nose.position.set(0, 1.05, -1.02);
      this.group.add(nose);

      const earGeo = new THREE.BoxGeometry(0.12, 0.28, 0.18);
      const earL = new THREE.Mesh(earGeo, darkMat);
      earL.position.set(-0.22, 1.35, -0.5);
      earL.rotation.z = 0.25;
      const earR = earL.clone();
      earR.position.x = 0.22;
      earR.rotation.z = -0.25;
      this.group.add(earL); this.group.add(earR);

      const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.04);
      const eyeMat = new THREE.MeshLambertMaterial({ color: 0x2b1b17 });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.12, 1.15, -0.84);
      const eyeR = eyeL.clone(); eyeR.position.x = 0.12;
      this.group.add(eyeL); this.group.add(eyeR);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.45), darkMat);
      tail.position.set(0, 0.85, 0.7);
      tail.rotation.x = 0.6;
      this.group.add(tail);
      this.tail = tail;

      const legGeo = new THREE.BoxGeometry(0.14, 0.38, 0.14);
      this.legs = [];
      const legPositions = [
        [-0.25, 0.19, -0.35],
        [0.25, 0.19, -0.35],
        [-0.25, 0.19, 0.35],
        [0.25, 0.19, 0.35]
      ];
      for (let i = 0; i < legPositions.length; i++) {
        const leg = new THREE.Mesh(legGeo, darkMat);
        leg.position.set(legPositions[i][0], legPositions[i][1], legPositions[i][2]);
        this.group.add(leg);
        this.legs.push(leg);
      }

      this.baseMaterials = [];
      this.group.traverse(function (obj) {
        if (obj.isMesh && obj.material) {
          obj.userData.baseColor = obj.material.color.getHex();
          this.baseMaterials.push(obj);
        }
      }.bind(this));

      scene.add(this.group);
    },

    reset: function () {
      this.laneIndex = 1;
      this.targetX = C.lanes[this.laneIndex];
      this.group.position.set(this.targetX, 0, C.playerZ);
      this.runTime = 0;
      this.hitTimer = 0;
      this.invulnTimer = 0;
      this.flashTimer = 0;
      this.slowFactor = 1;
      this.setFlash(false);
    },

    setLaneDirection: function (dir) {
      const next = this.laneIndex + dir;
      if (next < 0 || next >= C.lanes.length) return;
      this.laneIndex = next;
      this.targetX = C.lanes[this.laneIndex];
    },

    hit: function () {
      if (this.invulnTimer > 0) return false;
      this.hitTimer = C.player.hitRecoveryTime;
      this.invulnTimer = C.player.hitInvulnerabilityTime;
      this.flashTimer = 0.25;
      this.slowFactor = C.player.hitSlowFactor;
      this.setFlash(true);
      return true;
    },

    setFlash: function (on) {
      for (let i = 0; i < this.baseMaterials.length; i++) {
        const mesh = this.baseMaterials[i];
        if (on) {
          mesh.material.color.setHex(C.palette.hitFlash);
        } else {
          mesh.material.color.setHex(mesh.userData.baseColor);
        }
      }
    },

    update: function (delta, externalSpeedFactor) {
      const moveT = Math.min(1, delta * C.player.laneChangeSpeed);
      this.group.position.x += (this.targetX - this.group.position.x) * moveT;

      if (this.hitTimer > 0) {
        this.hitTimer -= delta;
        const t = 1 - Math.max(0, this.hitTimer) / C.player.hitRecoveryTime;
        this.slowFactor = C.player.hitSlowFactor + (1 - C.player.hitSlowFactor) * t;
        if (this.hitTimer <= 0) this.slowFactor = 1;
      }
      if (this.invulnTimer > 0) this.invulnTimer -= delta;
      if (this.flashTimer > 0) {
        this.flashTimer -= delta;
        if (this.flashTimer <= 0) this.setFlash(false);
      }

      const runFactor = (externalSpeedFactor || 1) * this.slowFactor;
      this.runTime += delta * C.player.baseRunFrequency * Math.max(0.5, runFactor);
      const bounce = Math.sin(this.runTime) * 0.06 * Math.min(1.4, runFactor);
      this.group.position.y = Math.max(0, bounce);
      this.group.rotation.z = (this.targetX - this.group.position.x) * -0.04;
      if (this.tail) this.tail.rotation.y = Math.sin(this.runTime * 1.7) * 0.5;

      const swing = Math.sin(this.runTime) * 0.6;
      for (let i = 0; i < this.legs.length; i++) {
        const phase = (i === 0 || i === 3) ? swing : -swing;
        this.legs[i].rotation.x = phase;
        this.legs[i].position.y = 0.19 + Math.max(0, -phase) * 0.03;
      }

      return this.slowFactor;
    },

    getLaneIndex: function () { return this.laneIndex; },
    getPosition: function () { return this.group.position; }
  };
})();
