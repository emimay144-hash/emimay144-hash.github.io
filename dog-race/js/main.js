(function () {
  if (!window.THREE) {
    var container = document.getElementById("game-container");
    if (container) {
      container.innerHTML = '<div style="padding:20px;font-family:sans-serif;color:#7b2d26;background:#fff7e6;">Could not load Three.js. Please check your internet connection and reopen index.html.</div>';
    }
    return;
  }

  var C = window.GameConstants;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(C.palette.sky);
  scene.fog = new THREE.Fog(C.palette.sky, 40, 140);

  var camera = new THREE.PerspectiveCamera(C.camera.fov, window.innerWidth / window.innerHeight, C.camera.near, C.camera.far);
  camera.position.set(C.camera.position.x, C.camera.position.y, C.camera.position.z);
  camera.lookAt(C.camera.lookAt.x, C.camera.lookAt.y, C.camera.lookAt.z);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("game-container").appendChild(renderer.domElement);

  var hemi = new THREE.HemisphereLight(0xfff7e6, 0x6f8f5b, 0.95);
  scene.add(hemi);
  var dir = new THREE.DirectionalLight(0xfff3d6, 0.85);
  dir.position.set(5, 10, 6);
  scene.add(dir);
  var fill = new THREE.DirectionalLight(0xbfd9ff, 0.25);
  fill.position.set(-4, 6, 2);
  scene.add(fill);

  window.UI.init({
    onStart: function () { window.Game.start(); },
    onResume: function () { window.Game.resume(); },
    onRestart: function () { window.Game.restartLevel(); },
    onNextLevel: function () { window.Game.nextLevel(); }
  });

  window.Game.init(scene);

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener("keydown", function (e) {
    var handled = ["ArrowLeft", "ArrowRight", "KeyP", "Escape", "Enter", "Space"];
    if (handled.indexOf(e.code) !== -1) {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "Space") e.preventDefault();
      window.Game.handleInput(e.code);
    }
  });

  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var delta = Math.min(clock.getDelta(), 0.05);
    window.Game.update(delta);
    renderer.render(scene, camera);
  }
  animate();
})();
