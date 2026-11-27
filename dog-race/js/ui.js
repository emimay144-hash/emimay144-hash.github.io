(function () {
  const elements = {};

  function cache() {
    elements.hud = document.getElementById("hud");
    elements.hudLevel = document.getElementById("hud-level");
    elements.hudProgress = document.getElementById("hud-progress");
    elements.hudSpeed = document.getElementById("hud-speed");
    elements.startScreen = document.getElementById("start-screen");
    elements.pauseScreen = document.getElementById("pause-screen");
    elements.levelCompleteScreen = document.getElementById("level-complete-screen");
    elements.levelCompleteText = document.getElementById("level-complete-text");
    elements.achievementText = document.getElementById("achievement-text");
    elements.message = document.getElementById("message");
    elements.startButton = document.getElementById("start-button");
    elements.resumeButton = document.getElementById("resume-button");
    elements.restartPauseButton = document.getElementById("restart-button-pause");
    elements.nextLevelButton = document.getElementById("next-level-button");
  }

  function hideAllPanels() {
    elements.startScreen.classList.add("hidden");
    elements.pauseScreen.classList.add("hidden");
    elements.levelCompleteScreen.classList.add("hidden");
  }

  function showStart() {
    hideAllPanels();
    elements.hud.classList.add("hidden");
    elements.startScreen.classList.remove("hidden");
  }

  function showHud() {
    elements.hud.classList.remove("hidden");
  }

  function showPause() {
    hideAllPanels();
    elements.pauseScreen.classList.remove("hidden");
  }

  function showLevelComplete(level, nextLevel) {
    hideAllPanels();
    elements.levelCompleteText.textContent = "You reached the bone prize and finished level " + level + "!";
    elements.achievementText.textContent = "Achievement unlocked: Level " + level + " Champion. Next up: Level " + nextLevel + " (faster!).";
    elements.levelCompleteScreen.classList.remove("hidden");
  }

  function hidePanelsForPlay() {
    hideAllPanels();
    showHud();
  }

  function updateHud(level, progressRatio, speedMultiplier) {
    const pct = Math.max(0, Math.min(100, Math.floor(progressRatio * 100)));
    elements.hudLevel.textContent = String(level);
    elements.hudProgress.textContent = pct + "%";
    elements.hudSpeed.textContent = speedMultiplier.toFixed(1) + "x";
  }

  let messageTimer = null;
  function showMessage(text, durationMs) {
    if (!elements.message) return;
    elements.message.textContent = text;
    elements.message.classList.remove("hidden");
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = setTimeout(function () {
      elements.message.classList.add("hidden");
    }, durationMs || 1200);
  }

  function bindHandlers(handlers) {
    elements.startButton.addEventListener("click", handlers.onStart);
    elements.resumeButton.addEventListener("click", handlers.onResume);
    elements.restartPauseButton.addEventListener("click", handlers.onRestart);
    elements.nextLevelButton.addEventListener("click", handlers.onNextLevel);
  }

  window.UI = {
    init: function (handlers) {
      cache();
      bindHandlers(handlers || {});
      showStart();
    },
    showStart: showStart,
    showHud: showHud,
    showPause: showPause,
    showLevelComplete: showLevelComplete,
    hidePanelsForPlay: hidePanelsForPlay,
    updateHud: updateHud,
    showMessage: showMessage
  };
})();
