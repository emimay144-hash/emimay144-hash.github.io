(function () {
  const palette = {
    mutedOrange: 0xd98c4a,
    sunshineYellow: 0xf4d35e,
    fireplaceMaroon: 0x7b2d26,
    forestGreen: 0x2f5d50,
    oceanBlue: 0x3a7ca5,
    cream: 0xfff7e6,
    sky: 0xa7d3d9,
    grass: 0x6f8f5b,
    track: 0xc89b67,
    laneMark: 0xfff1bf,
    puddle: 0x4f86a8,
    cone: 0xd98c4a,
    hay: 0xf4d35e,
    bone: 0xfff7e6,
    dog: 0xd98c4a,
    dogDark: 0x8a5a2b,
    hitFlash: 0xffffff
  };

  window.GameConstants = {
    palette: palette,
    lanes: [-2.2, 0, 2.2],
    laneTolerance: 0.9,
    playerZ: 4.5,
    camera: {
      fov: 60,
      near: 0.1,
      far: 220,
      position: { x: 0, y: 5.2, z: 10.5 },
      lookAt: { x: 0, y: 1.2, z: -6 }
    },
    track: {
      width: 8.2,
      length: 180,
      segmentSpacing: 6,
      scenerySpacing: 10
    },
    level: {
      baseSpeed: 11,
      speedPerLevel: 1.35,
      baseDistance: 220,
      distancePerLevel: 18,
      baseObstacleInterval: 1.35,
      obstacleIntervalDecay: 0.06,
      minObstacleInterval: 0.55,
      baseMaxObstacles: 6,
      maxObstaclesPerLevel: 1
    },
    player: {
      laneChangeSpeed: 12,
      baseRunFrequency: 9,
      hitSlowFactor: 0.45,
      hitRecoveryTime: 1.1,
      hitInvulnerabilityTime: 0.35
    },
    competitors: {
      count: 3,
      zMin: 2.2,
      zMax: 6.8,
      speedFactorMin: 0.82,
      speedFactorMax: 1.08,
      lateralAmplitude: 0.18
    },
    obstacleTypes: ["cone", "puddle", "hay"],
    colorsByCompetitor: [palette.forestGreen, palette.oceanBlue, palette.fireplaceMaroon, palette.sunshineYellow]
  };
})();
