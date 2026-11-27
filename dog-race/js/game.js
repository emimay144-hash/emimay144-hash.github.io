(function () {
  const C = window.GameConstants;

  const STATE = {
    START: "start",
    PLAYING: "playing",
    PAUSED: "paused",
    LEVEL_COMPLETE: "level_complete"
  };

  window.Game = {
    init: function (scene) {
      this.scene = scene;
      this.state = STATE.START;
      this.level = 1;
      this.distance = 0;
      this.levelDistance = C.level.baseDistance;
      this.baseSpeed = C.level.baseSpeed;
      this.currentSpeedMultiplier = 1;
      this.playerSpeedFactor = 1;

      window.Track.init(scene);
      window.Player.init(scene);
      window.Obstacles.init(scene);
      window.Competitors.init(scene);
      this.resetLevel(1);
    },

    getLevelSpeed: function () {
      return C.level.baseSpeed + (this.level - 1) * C.level.speedPerLevel;
    },

    getSpeedMultiplierDisplay: function () {
      return this.getLevelSpeed() / C.level.baseSpeed;
    },

    resetLevel: function (level) {
      this.level = level;
      this.distance = 0;
      this.levelDistance = C.level.baseDistance + (level - 1) * C.level.distancePerLevel;
      this.baseSpeed = this.getLevelSpeed();
      window.Track.reset();
      window.Player.reset();
      window.Obstacles.spawnForLevel(level, this.levelDistance);
      window.Competitors.reset(level);
      window.UI.updateHud(this.level, 0, this.getSpeedMultiplierDisplay());
    },

    start: function () {
      this.resetLevel(1);
      this.state = STATE.PLAYING;
      window.UI.hidePanelsForPlay();
      window.UI.showMessage("Go! Reach the bone!", 1400);
    },

    restartLevel: function () {
      this.resetLevel(this.level);
      this.state = STATE.PLAYING;
      window.UI.hidePanelsForPlay();
      window.UI.showMessage("Level restarted", 1000);
    },

    nextLevel: function () {
      const next = this.level + 1;
      this.resetLevel(next);
      this.state = STATE.PLAYING;
      window.UI.hidePanelsForPlay();
      window.UI.showMessage("Level " + next + " - faster!", 1400);
    },

    pause: function () {
      if (this.state !== STATE.PLAYING) return;
      this.state = STATE.PAUSED;
      window.UI.showPause();
    },

    resume: function () {
      if (this.state !== STATE.PAUSED) return;
      this.state = STATE.PLAYING;
      window.UI.hidePanelsForPlay();
    },

    togglePause: function () {
      if (this.state === STATE.PLAYING) this.pause();
      else if (this.state === STATE.PAUSED) this.resume();
    },

    handleInput: function (key) {
      if (key === "ArrowLeft") {
        if (this.state === STATE.PLAYING) window.Player.setLaneDirection(-1);
      } else if (key === "ArrowRight") {
        if (this.state === STATE.PLAYING) window.Player.setLaneDirection(1);
      } else if (key === "KeyP" || key === "Escape") {
        if (this.state === STATE.PLAYING || this.state === STATE.PAUSED) this.togglePause();
      } else if (key === "Enter" || key === "Space") {
        if (this.state === STATE.START) this.start();
        else if (this.state === STATE.LEVEL_COMPLETE) this.nextLevel();
        else if (this.state === STATE.PAUSED) this.resume();
      }
    },

    completeLevel: function () {
      this.state = STATE.LEVEL_COMPLETE;
      window.UI.showLevelComplete(this.level, this.level + 1);
      window.UI.showMessage("Bone collected!", 1200);
    },

    update: function (delta) {
      if (this.state !== STATE.PLAYING) return;

      const speedFactor = window.Player.update(delta, this.getSpeedMultiplierDisplay());
      const effectiveSpeed = this.baseSpeed * speedFactor;

      this.distance += effectiveSpeed * delta;
      const progress = Math.min(1, this.distance / this.levelDistance);

      window.Track.update(delta, effectiveSpeed);
      window.Obstacles.update(delta, effectiveSpeed, this.level);
      window.Competitors.update(delta, effectiveSpeed, this.level);

      const collision = window.Obstacles.checkCollisions(window.Player);
      if (collision.hit) {
        const applied = window.Player.hit();
        if (applied) window.UI.showMessage("Bump! Slowed down...", 900);
      }

      if (window.Obstacles.checkBoneReached(window.Player) || progress >= 1) {
        this.completeLevel();
        return;
      }

      window.UI.updateHud(this.level, progress, this.getSpeedMultiplierDisplay());
    }
  };
})();
