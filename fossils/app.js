/* Fossil Layers and Mass Extinction Explorer - revised plan implementation
   Fictional, simplified teaching model. All results are temporary (in-memory). */
(function () {
  'use strict';

  const MAX_ATTEMPTS = 5;
  const SIM_STEPS = 5;

  const FACTORS = {
    temperature: {
      id: 'temperature',
      label: 'Temperature shift',
      description: 'Conditions become hotter or colder, changing habitats and stress on species.',
      indicatorLabel: 'Temperature stress',
      unit: 'stress level',
      landscape: { calm: 'linear-gradient(#9fd3ff 0 45%, #7ec96d 45% 70%, #bfa77a 70% 100%)', severe: 'linear-gradient(#ffd7a8 0 45%, #c9b458 45% 70%, #d9b07a 70% 100%)' }
    },
    seaLevel: {
      id: 'seaLevel',
      label: 'Sea level change',
      description: 'Water rises or falls, flooding habitats or exposing new areas.',
      indicatorLabel: 'Sea level stress',
      unit: 'stress level',
      landscape: { calm: 'linear-gradient(#9fd3ff 0 35%, #5fb3d9 35% 55%, #cdbb99 55% 100%)', severe: 'linear-gradient(#7fc8ff 0 60%, #4ea0cf 60% 78%, #cdbb99 78% 100%)' }
    },
    oxygen: {
      id: 'oxygen',
      label: 'Ocean oxygen drop',
      description: 'Oxygen levels fall in water, making it harder for some species to survive.',
      indicatorLabel: 'Low-oxygen stress',
      unit: 'stress level',
      landscape: { calm: 'linear-gradient(#a8dcff 0 45%, #4aaed1 45% 75%, #bfa77a 75% 100%)', severe: 'linear-gradient(#9fb9c9 0 45%, #5f8797 45% 75%, #a99776 75% 100%)' }
    },
    rainfall: {
      id: 'rainfall',
      label: 'Rainfall pattern change',
      description: 'Rain becomes much heavier or much scarcer, altering soils and water supply.',
      indicatorLabel: 'Moisture stress',
      unit: 'stress level',
      landscape: { calm: 'linear-gradient(#a8d8ff 0 40%, #6dbf5b 40% 72%, #b89263 72% 100%)', severe: 'linear-gradient(#dce8f2 0 40%, #9aa45a 40% 72%, #d1b07a 72% 100%)' }
    },
    volcanicAsh: {
      id: 'volcanicAsh',
      label: 'Volcanic ash and cooling',
      description: 'Ash and particles block light and cool the environment, stressing ecosystems.',
      indicatorLabel: 'Ash and cooling stress',
      unit: 'stress level',
      landscape: { calm: 'linear-gradient(#bfe4ff 0 45%, #78bf63 45% 72%, #bfa77a 72% 100%)', severe: 'linear-gradient(#b8b8b8 0 45%, #7d8a6b 45% 72%, #9e9278 72% 100%)' }
    }
  };

  function layer(name, age, abundanceLabel, diversityLabel, summary, annotation, fossils) {
    return { name, age, abundanceLabel, diversityLabel, summary, annotation, fossils };
  }

  const ECOSYSTEMS = [
    {
      id: 'reef-shallows',
      name: 'Reef Shallows',
      description: 'A warm, shallow reef with shelled, branching, and swimming life. Layers record changes in reef conditions over time.',
      traits: 'Starting biodiversity: high (5 species groups). Traits: some groups tolerate gradual warming, but branching and floating forms are vulnerable to rapid or severe shifts.',
      availableFactors: ['temperature', 'seaLevel', 'oxygen'],
      defaultFactor: 'temperature',
      species: [
        { id: 'spiral-shells', name: 'Spiral Shells', color: '#d97706', icon: 'spiral', rateTol: 70, sevTol: 70, base: 4, note: 'Moderately tolerant to pace and size of change.' },
        { id: 'fan-corals', name: 'Fan Corals', color: '#e11d48', icon: 'fan', rateTol: 30, sevTol: 45, base: 4, note: 'Sensitive to rapid or severe change.' },
        { id: 'drift-swimmers', name: 'Drift Swimmers', color: '#2563eb', icon: 'oval', rateTol: 80, sevTol: 35, base: 3, note: 'Handles fast change but not severe conditions.' },
        { id: 'burrow-clams', name: 'Burrow Clams', color: '#7c3aed', icon: 'clam', rateTol: 35, sevTol: 85, base: 3, note: 'Can cope with severe change if it is slow.' },
        { id: 'mat-algae', name: 'Mat Builders', color: '#15803d', icon: 'mat', rateTol: 85, sevTol: 80, base: 3, note: 'Broad tolerance in this model.' }
      ],
      layers: [
        layer('Layer 1 (oldest)', 'Oldest reef deposit', 'very high', 'high', 'Many fossil types appear together across the rock surface.', 'A busy reef sample: spiral shells, fan corals, swimmers, clams, and mats are all visible.', { 'spiral-shells': 4, 'fan-corals': 4, 'drift-swimmers': 3, 'burrow-clams': 3, 'mat-algae': 3 }),
        layer('Layer 2', 'Older reef deposit', 'very high', 'high', 'Fossil variety remains broad and traces are common.', 'Little change from below: most groups remain common in the diagram.', { 'spiral-shells': 4, 'fan-corals': 4, 'drift-swimmers': 3, 'burrow-clams': 3, 'mat-algae': 3 }),
        layer('Layer 3', 'Middle reef deposit', 'high', 'high', 'Most groups still appear, though branching forms begin to thin.', 'Fan corals look less common than in older layers, but diversity is still fairly broad.', { 'spiral-shells': 4, 'fan-corals': 2, 'drift-swimmers': 3, 'burrow-clams': 3, 'mat-algae': 3 }),
        layer('Layer 4', 'Younger reef deposit', 'low', 'low', 'Only a few fossil types remain and traces are sparse.', 'A sharp drop: fan corals and drift swimmers are absent from the sample; only a few hardy groups remain.', { 'spiral-shells': 2, 'burrow-clams': 2, 'mat-algae': 2 }),
        layer('Layer 5 (youngest)', 'Youngest reef deposit', 'low', 'low', 'Sparse fossils suggest limited recovery in this sample.', 'Few species groups appear; mats and occasional shells dominate the diagram.', { 'spiral-shells': 1, 'burrow-clams': 1, 'mat-algae': 2 })
      ],
      correctBoundaryChoices: [2],
      boundaryExplanation: 'The strongest evidence is between Layer 3 and Layer 4: the annotated diagrams show a marked drop in both fossil variety and abundance. Some decline begins earlier, but the clearest boundary in this ecosystem is at that transition.'
    },
    {
      id: 'fern-delta',
      name: 'Fern Delta',
      description: 'A coastal delta with plant mats, armored crawlers, and floating feeders preserved in muddy rock layers.',
      traits: 'Starting biodiversity: medium-high (5 species groups). Traits: burrowers tolerate slow severe change, while crawlers are sensitive to both pace and severity.',
      availableFactors: ['rainfall', 'temperature', 'volcanicAsh'],
      defaultFactor: 'rainfall',
      species: [
        { id: 'frond-mats', name: 'Frond Mats', color: '#16a34a', icon: 'leaf', rateTol: 75, sevTol: 75, base: 4, note: 'Fairly tolerant across conditions.' },
        { id: 'plate-crawlers', name: 'Plate Crawlers', color: '#92400e', icon: 'plate', rateTol: 40, sevTol: 40, base: 4, note: 'Sensitive to rapid and severe change.' },
        { id: 'sail-floaters', name: 'Sail Floaters', color: '#0891b2', icon: 'sail', rateTol: 85, sevTol: 30, base: 3, note: 'Vulnerable when conditions become severe.' },
        { id: 'mud-tubes', name: 'Mud Tubes', color: '#6d28d9', icon: 'tube', rateTol: 25, sevTol: 80, base: 3, note: 'Tolerates severe change only when slow.' },
        { id: 'seed-pods', name: 'Seed Pods', color: '#ca8a04', icon: 'seed', rateTol: 65, sevTol: 60, base: 3, note: 'Moderately tolerant.' }
      ],
      layers: [
        layer('Layer 1 (oldest)', 'Oldest delta mudstone', 'very high', 'high', 'A rich mix of plant and animal traces fills the layer.', 'Frond mats, crawlers, floaters, tubes, and pods all appear common.', { 'frond-mats': 4, 'plate-crawlers': 4, 'sail-floaters': 3, 'mud-tubes': 3, 'seed-pods': 3 }),
        layer('Layer 2', 'Older floodplain deposit', 'high', 'high', 'Most groups persist with only slight variation.', 'Crawlers and mats remain easy to spot; variety is still broad.', { 'frond-mats': 4, 'plate-crawlers': 3, 'sail-floaters': 3, 'mud-tubes': 3, 'seed-pods': 3 }),
        layer('Layer 3', 'Middle disturbed layer', 'medium', 'medium', 'Several groups thin out and the mix becomes uneven.', 'Crawlers are scarce and pods less common; other groups remain but in smaller numbers.', { 'frond-mats': 3, 'plate-crawlers': 1, 'sail-floaters': 2, 'mud-tubes': 2, 'seed-pods': 1 }),
        layer('Layer 4', 'Younger recovery layer', 'low', 'low', 'Few fossil types are present and overall traces are limited.', 'Mainly mats and tubes remain; most other groups are no longer seen in this sample.', { 'frond-mats': 3, 'mud-tubes': 2, 'sail-floaters': 1 }),
        layer('Layer 5 (youngest)', 'Youngest delta deposit', 'low', 'low', 'A sparse assemblage suggests a reduced community.', 'Only a couple of tolerant groups appear consistently.', { 'frond-mats': 2, 'mud-tubes': 2 })
      ],
      correctBoundaryChoices: [1, 2],
      boundaryExplanation: 'In this ecosystem the evidence is uncertain across more than one transition. Fossil variety and abundance begin to fall after Layer 2 and drop further by Layer 4, so marking between Layer 2-3 or Layer 3-4 can both be supported by the diagrams. This shows change can span several layers rather than one sharp line.'
    },
    {
      id: 'tidal-plains',
      name: 'Tidal Plains',
      description: 'Broad tidal flats where burrowers, grazers, and floating colonies are preserved in sandy and silty layers.',
      traits: 'Starting biodiversity: high (5 species groups). Traits: floating colonies dislike severe change, while burrowers and hardy mats can persist under some conditions.',
      availableFactors: ['seaLevel', 'temperature', 'rainfall'],
      defaultFactor: 'seaLevel',
      species: [
        { id: 'coil-grazers', name: 'Coil Grazers', color: '#0f766e', icon: 'coil', rateTol: 55, sevTol: 65, base: 4, note: 'Moderately tolerant.' },
        { id: 'ridge-shells', name: 'Ridge Shells', color: '#b45309', icon: 'ridge', rateTol: 30, sevTol: 55, base: 4, note: 'Struggles when change is rapid.' },
        { id: 'sky-jellies', name: 'Float Colonies', color: '#0284c7', icon: 'float', rateTol: 90, sevTol: 25, base: 3, note: 'Sensitive to severe change.' },
        { id: 'spine-burrowers', name: 'Spine Burrowers', color: '#be123c', icon: 'spine', rateTol: 45, sevTol: 85, base: 3, note: 'Tolerates severe change if gradual.' },
        { id: 'dust-moss', name: 'Dust Mats', color: '#65a30d', icon: 'dust', rateTol: 80, sevTol: 70, base: 3, note: 'Broad tolerance.' }
      ],
      layers: [
        layer('Layer 1 (oldest)', 'Oldest tidal sand', 'very high', 'high', 'Abundant, varied fossils suggest a stable community.', 'Grazers, shells, float colonies, burrowers, and mats all appear.', { 'coil-grazers': 4, 'ridge-shells': 4, 'sky-jellies': 3, 'spine-burrowers': 3, 'dust-moss': 3 }),
        layer('Layer 2', 'Older tidal sand', 'very high', 'high', 'The assemblage remains rich and diverse.', 'Little visible change from the layer below.', { 'coil-grazers': 4, 'ridge-shells': 4, 'sky-jellies': 3, 'spine-burrowers': 3, 'dust-moss': 3 }),
        layer('Layer 3', 'Middle tidal silt', 'high', 'high', 'Most groups persist with minor thinning.', 'Slightly fewer shells appear, but diversity remains broad.', { 'coil-grazers': 4, 'ridge-shells': 3, 'sky-jellies': 3, 'spine-burrowers': 3, 'dust-moss': 3 }),
        layer('Layer 4', 'Upper tidal silt', 'medium', 'medium', 'Some groups fade while others remain common.', 'Float colonies are rarer; grazers and shells are reduced compared with older layers.', { 'coil-grazers': 3, 'ridge-shells': 2, 'sky-jellies': 1, 'spine-burrowers': 3, 'dust-moss': 3 }),
        layer('Layer 5 (youngest)', 'Youngest tidal deposit', 'low', 'low', 'A clear reduction in fossil variety and abundance.', 'Only burrowers and mats are consistently present; most other groups are missing.', { 'spine-burrowers': 2, 'dust-moss': 3, 'coil-grazers': 1 })
      ],
      correctBoundaryChoices: [3],
      boundaryExplanation: 'The clearest boundary is between Layer 4 and Layer 5, where annotations indicate a strong drop in both diversity and abundance. Earlier layers show gradual thinning, but the youngest layer records the most pronounced loss in this sample.'
    },
    {
      id: 'ash-forest',
      name: 'Volcanic Ash Forest',
      description: 'A forested basin periodically buried by ash. Fossils include leaves, insects, burrowers, and small shelled animals.',
      traits: 'Starting biodiversity: medium (5 species groups, uneven abundance). Traits: fast ash/cooling events strongly affect surface feeders, while some burrowers and hardy plants persist if change is limited.',
      availableFactors: ['volcanicAsh', 'temperature', 'rainfall'],
      defaultFactor: 'volcanicAsh',
      species: [
        { id: 'fern-fronds', name: 'Fern Fronds', color: '#15803d', icon: 'leaf', rateTol: 60, sevTol: 55, base: 4, note: 'Moderate tolerance; stressed by heavy ash/cooling.' },
        { id: 'amber-flies', name: 'Amber Flies', color: '#d97706', icon: 'wing', rateTol: 35, sevTol: 35, base: 3, note: 'Very sensitive to rapid, severe change.' },
        { id: 'bark-beetles', name: 'Bark Beetles', color: '#78350f', icon: 'beetle', rateTol: 50, sevTol: 45, base: 3, note: 'Sensitive when habitat changes quickly.' },
        { id: 'ash-burrowers', name: 'Ash Burrowers', color: '#6b7280', icon: 'burrow', rateTol: 40, sevTol: 85, base: 3, note: 'Can survive severe change if gradual.' },
        { id: 'pond-snails', name: 'Pond Snails', color: '#2563eb', icon: 'snail', rateTol: 70, sevTol: 50, base: 2, note: 'Tolerates pace but not severe disruption.' }
      ],
      layers: [
        layer('Layer 1 (oldest)', 'Oldest forest soil', 'high', 'medium-high', 'Plant fossils are common with a moderate mix of animals.', 'Fronds, flies, beetles, burrowers, and a few snails appear together.', { 'fern-fronds': 4, 'amber-flies': 3, 'bark-beetles': 3, 'ash-burrowers': 3, 'pond-snails': 2 }),
        layer('Layer 2', 'Ash-flecked soil', 'medium', 'medium', 'Fossils thin slightly after minor disturbance.', 'Most groups remain, but insects and snails are less common in the annotations.', { 'fern-fronds': 3, 'amber-flies': 2, 'bark-beetles': 2, 'ash-burrowers': 3, 'pond-snails': 1 }),
        layer('Layer 3', 'Thick ash layer', 'low', 'low', 'A sharp reduction in variety and abundance is evident.', 'Only scattered fronds and burrowers remain; delicate insects and snails are absent.', { 'fern-fronds': 1, 'ash-burrowers': 2 }),
        layer('Layer 4', 'Reworked ash deposit', 'low', 'low', 'Sparse traces suggest a stressed environment.', 'Burrowers dominate the few fossils present; plant traces are rare.', { 'ash-burrowers': 2, 'fern-fronds': 1 }),
        layer('Layer 5 (youngest)', 'Stabilising soil', 'medium-low', 'low-medium', 'Some recovery begins but diversity stays limited.', 'Fronds and burrowers return in modest amounts; earlier insect variety does not reappear.', { 'fern-fronds': 2, 'ash-burrowers': 2, 'pond-snails': 1 })
      ],
      correctBoundaryChoices: [1],
      boundaryExplanation: 'The clearest boundary is between Layer 2 and Layer 3. The annotated diagram for Layer 3 shows a sudden loss of insect and snail groups and a strong drop in overall abundance compared with the layers below, consistent with a major disruption.'
    },
    {
      id: 'glacial-lake',
      name: 'Glacial Lake',
      description: 'A cold lake basin with seasonal layers preserving algae, swimmers, bottom-dwellers, and shoreline plants.',
      traits: 'Starting biodiversity: medium (5 species groups). Traits: some species tolerate cold/oxygen shifts if gradual, but severe rapid change reduces both open-water and bottom life.',
      availableFactors: ['temperature', 'oxygen', 'rainfall'],
      defaultFactor: 'oxygen',
      species: [
        { id: 'ribbon-algae', name: 'Ribbon Algae', color: '#16a34a', icon: 'ribbon', rateTol: 75, sevTol: 65, base: 4, note: 'Fairly tolerant but affected by severe stress.' },
        { id: 'fin-swimmers', name: 'Fin Swimmers', color: '#0284c7', icon: 'fin', rateTol: 70, sevTol: 40, base: 3, note: 'Sensitive to severe oxygen/condition change.' },
        { id: 'shell-crawlers', name: 'Shell Crawlers', color: '#a16207', icon: 'crawler', rateTol: 45, sevTol: 60, base: 3, note: 'Struggles with rapid change.' },
        { id: 'deep-burrowers', name: 'Deep Burrowers', color: '#7c3aed', icon: 'burrow', rateTol: 35, sevTol: 80, base: 3, note: 'Handles severe change if slow.' },
        { id: 'reed-fragments', name: 'Reed Fragments', color: '#65a30d', icon: 'reed', rateTol: 60, sevTol: 55, base: 2, note: 'Moderate tolerance.' }
      ],
      layers: [
        layer('Layer 1 (oldest)', 'Oldest lake mud', 'high', 'medium-high', 'A varied set of water and shoreline fossils appears.', 'Algae, swimmers, crawlers, burrowers, and reeds are all represented.', { 'ribbon-algae': 4, 'fin-swimmers': 3, 'shell-crawlers': 3, 'deep-burrowers': 3, 'reed-fragments': 2 }),
        layer('Layer 2', 'Seasonal lake mud', 'high', 'medium-high', 'Conditions look stable with similar variety.', 'Most groups remain common; no major loss is indicated.', { 'ribbon-algae': 4, 'fin-swimmers': 3, 'shell-crawlers': 3, 'deep-burrowers': 3, 'reed-fragments': 2 }),
        layer('Layer 3', 'Darkening lake mud', 'medium', 'medium', 'Some open-water and shoreline groups become less common.', 'Swimmers and reeds thin out while algae and burrowers persist.', { 'ribbon-algae': 3, 'fin-swimmers': 1, 'shell-crawlers': 2, 'deep-burrowers': 3, 'reed-fragments': 1 }),
        layer('Layer 4', 'Low-oxygen layer', 'low', 'low-medium', 'Fossil abundance falls and fewer groups remain.', 'Mainly algae and burrowers are visible; other groups are rare or absent.', { 'ribbon-algae': 2, 'deep-burrowers': 2, 'shell-crawlers': 1 }),
        layer('Layer 5 (youngest)', 'Youngest lake mud', 'low', 'low', 'The sample remains sparse with limited diversity.', 'Only tolerant groups appear in small amounts.', { 'ribbon-algae': 2, 'deep-burrowers': 1 })
      ],
      correctBoundaryChoices: [2, 3],
      boundaryExplanation: 'The evidence suggests an uncertain boundary spanning the transition from Layer 3 to Layer 5. Diversity and abundance decline across more than one layer rather than at a single sharp point, so choices between Layer 3-4 and Layer 4-5 can both be justified from the annotations.'
    }
  ];

  let currentEcosystem = ECOSYSTEMS[0];
  let selectedLayerIndex = 0;
  let boundaryAttempts = 0;
  let boundaryResolved = false;
  let selectedBoundaryChoice = null;
  let selectedFactorId = currentEcosystem.defaultFactor;
  let runHistory = [];
  let vizTimer = null;
  let vizStep = 0;
  let sceneState = null;

  const els = {};
  function cacheEls() {
    [
      'reset-all','ecosystem-select','ecosystem-preview','ecosystem-description','ecosystem-traits',
      'three-root','layer-list','layer-details','attempt-status','boundary-choices','boundary-feedback',
      'factor-select','factor-description','rate-slider','severity-slider','rate-value','severity-value','rate-label','severity-label','rate-gauge','severity-gauge',
      'run-simulation','landscape-viz','sim-timeline','indicator-viz','viz-status','latest-result','run-comparison'
    ].forEach(id => els[id] = document.getElementById(id));
  }

  function esc(s) {
    return String(s).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function rateDescriptor(v) {
    if (v <= 20) return 'Very slow change';
    if (v <= 40) return 'Slow change';
    if (v <= 60) return 'Moderate rate of change';
    if (v <= 80) return 'Fast change';
    return 'Very rapid change';
  }
  function severityDescriptor(v) {
    if (v <= 20) return 'Very small change';
    if (v <= 40) return 'Small change';
    if (v <= 60) return 'Moderate change';
    if (v <= 80) return 'Large change';
    return 'Very large change';
  }

  function layerStats(layer, eco) {
    let abundance = 0, diversity = 0;
    eco.species.forEach(sp => {
      const c = layer.fossils[sp.id] || 0;
      abundance += c;
      if (c > 0) diversity += 1;
    });
    return { abundance, diversity };
  }

  function fossilDescriptor(count, base) {
    if (count <= 0) return 'not seen in this sample';
    const ratio = base ? count / base : 0;
    if (ratio >= 0.85) return 'common in this sample';
    if (ratio >= 0.45) return 'present in moderate amounts';
    return 'rare in this sample';
  }

  function formatBoundaryChoice(i, eco) {
    const below = eco.layers[i];
    const above = eco.layers[i + 1];
    return `Between ${below.name} and ${above.name}`;
  }

  function levelScore(label) {
    const l = String(label || '').toLowerCase();
    if (l === 'none') return 0;
    if (l === 'very low') return 15;
    if (l === 'low') return 30;
    if (l === 'medium') return 55;
    if (l === 'high') return 75;
    if (l === 'very high') return 100;
    return 50;
  }

  function renderMeter(label, level) {
    const pct = levelScore(level);
    return `<div class="meter-row"><span class="meter-label">${esc(label)}</span><div class="meter-track" aria-hidden="true"><div class="meter-fill" style="width:${pct}%"></div></div><span class="meter-value">${esc(level)} (${pct}%)</span></div>`;
  }

  function renderEcosystemPreview() {
    const eco = currentEcosystem;
    const f = FACTORS[eco.defaultFactor];
    const sceneBg = (f && f.landscape && f.landscape.calm) ? f.landscape.calm : 'linear-gradient(#9fd3ff 0 45%, #7ec96d 45% 70%, #bfa77a 70% 100%)';
    const legend = eco.species.map(sp => `<span class="legend-chip"><span class="legend-swatch" style="background:${esc(sp.color)}" aria-hidden="true">•</span><span>${esc(sp.name)}</span></span>`).join('');
    els['ecosystem-preview'].innerHTML = `
      <div class="eco-scene-cue" style="background:${sceneBg}"><span>${esc(eco.name)} visual preview</span></div>
      <div class="layer-evidence-visual">
        <div><strong>Starting biodiversity:</strong> ${eco.species.length} species groups</div>
        <div><strong>Layers to inspect:</strong> ${eco.layers.length} (oldest at bottom, youngest at top)</div>
      </div>
      <div><strong>Species/fossil legend</strong> (icons and colours; labels provided)</div>
      <div class="legend-grid" aria-label="Species legend">${legend}</div>
    `;
  }
  function initEcosystemSelect() {
    els['ecosystem-select'].innerHTML = ECOSYSTEMS.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
    els['ecosystem-select'].addEventListener('change', () => {
      const eco = ECOSYSTEMS.find(e => e.id === els['ecosystem-select'].value) || ECOSYSTEMS[0];
      setEcosystem(eco);
    });
  }

  function setEcosystem(eco) {
    clearVizTimer();
    currentEcosystem = eco;
    selectedLayerIndex = 0;
    boundaryAttempts = 0;
    boundaryResolved = false;
    selectedBoundaryChoice = null;
    selectedFactorId = eco.defaultFactor;
    runHistory = [];
    els['ecosystem-description'].textContent = eco.description;
    els['ecosystem-traits'].textContent = eco.traits;
    if (els['sim-timeline']) renderSimTimeline(null);
    els['landscape-viz'].innerHTML = '<p class="empty-state">Run an automatic visualisation to see the changing landscape.</p>';
    els['indicator-viz'].innerHTML = '';
    els['viz-status'].textContent = '';
    renderEcosystemPreview();
    renderFactorSelect();
    renderAll();
  }

  function renderFactorSelect() {
    const eco = currentEcosystem;
    els['factor-select'].innerHTML = eco.availableFactors.map(fid => {
      const f = FACTORS[fid];
      return `<option value="${f.id}">${esc(f.label)}</option>`;
    }).join('');
    els['factor-select'].value = selectedFactorId;
    updateFactorDescription();
  }

  function updateFactorDescription() {
    const f = FACTORS[selectedFactorId];
    els['factor-description'].textContent = f ? f.description : '';
  }

  function renderLayerList() {
    const eco = currentEcosystem;
    const items = eco.layers.map((layer, idx) => ({ layer, idx })).reverse(); // youngest/top first in UI, oldest/bottom last
    els['layer-list'].innerHTML = items.map(({ layer, idx }, visualPos) => {
      const selected = idx === selectedLayerIndex;
      const stats = layerStats(layer, eco);
      const meters = `<div class="layer-evidence-visual">${renderMeter('Abundance', layer.abundanceLabel)}${renderMeter('Diversity', layer.diversityLabel)}</div>`;
      const gapBelowIdx = idx - 1; // boundary between idx-1 (below, older) and idx (above, younger)
      let gapHtml = '';
      if (visualPos < items.length - 1) {
        const isChoice = selectedBoundaryChoice === gapBelowIdx;
        const isCorrect = boundaryResolved && eco.correctBoundaryChoices.includes(gapBelowIdx);
        const isRevealedWrong = boundaryResolved && isChoice && !eco.correctBoundaryChoices.includes(gapBelowIdx);
        const marker = isCorrect ? '✓ boundary evidence' : (isRevealedWrong ? '✕ your mark' : (isChoice ? '● your mark' : 'tap boundary strip below'));
        gapHtml = `<div class="boundary-gap" aria-hidden="true"><span class="boundary-gap-marker">${marker}</span></div>`;
      }
      return `<div class="layer-card-visual" role="listitem">
        <button type="button" class="layer-item ${selected ? 'selected' : ''}" data-index="${idx}" aria-pressed="${selected}">
          <span>
            <strong>${esc(layer.name)}</strong> ${selected ? '<span class="selected-marker">• inspecting</span>' : ''}<br>
            <span class="layer-meta">${esc(layer.age)}</span><br>
            <span class="layer-meta">${esc(layer.summary)}</span>
            ${meters}
          </span>
          <span class="layer-meta">Visible groups: ${stats.diversity}/${eco.species.length}</span>
        </button>
        ${gapHtml}
      </div>`;
    }).join('');
    els['layer-list'].querySelectorAll('.layer-item').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLayerIndex = Number(btn.dataset.index);
        renderLayerList();
        renderLayerDetails();
        updateSceneSelection();
      });
    });
  }

  function renderLayerDetails() {
    const eco = currentEcosystem;
    const layer = eco.layers[selectedLayerIndex];
    if (!layer) { els['layer-details'].innerHTML = ''; return; }
    const chips = `
      <div class="evidence-chips" aria-label="Layer evidence summary">
        <span class="chip">Abundance: ${esc(layer.abundanceLabel)}</span>
        <span class="chip">Diversity: ${esc(layer.diversityLabel)}</span>
        <span class="chip">Layer: ${esc(layer.name)}</span>
      </div>`;
    const diagram = renderLayerDiagram(layer, eco);
    const annotations = eco.species.map(sp => {
      const count = layer.fossils[sp.id] || 0;
      return `<li><strong>${esc(sp.name)}:</strong> ${esc(fossilDescriptor(count, sp.base))}. ${esc(sp.note)}</li>`;
    }).join('');
    els['layer-details'].innerHTML = `
      <p><strong>${esc(layer.name)}</strong> — ${esc(layer.age)}</p>
      ${chips}
      <div class="layer-diagram">${diagram}</div>
      <p><strong>Annotated diagram notes:</strong> ${esc(layer.annotation)}</p>
      <ul class="annotation-list">${annotations}</ul>
      <p class="note">Use these annotations to infer changes in abundance and diversity. Diagrams show fossil evidence from a sample; preservation varies and the record is incomplete.</p>
    `;
  }

  function renderLayerDiagram(layer, eco) {
    const w = 520, h = 170;
    const rockColors = ['#d2c2a2','#c8b79a','#bfae8f','#cdbf9e','#b7a889'];
    const bg = rockColors[selectedLayerIndex % rockColors.length];
    const present = eco.species.filter(sp => (layer.fossils[sp.id] || 0) > 0);
    const icons = present.map((sp, i) => {
      const count = layer.fossils[sp.id] || 0;
      const base = sp.base || 1;
      const n = Math.max(1, Math.min(4, Math.round((count / base) * 3)));
      const group = [];
      for (let k = 0; k < n; k++) {
        const x = 35 + (i * 95) + (k % 2) * 16;
        const y = 58 + Math.floor(k / 2) * 24 + (i % 2) * 4;
        group.push(svgFossil(sp.icon, x, y, sp.color));
      }
      const labelY = 138;
      return `<g aria-label="${esc(sp.name)}: ${esc(fossilDescriptor(count, base))}">${group.join('')}<text x="${30 + i * 95}" y="${labelY}" font-size="11" fill="#1f2a1f">${esc(shortName(sp.name))}</text></g>`;
    }).join('');
    const emptyNote = present.length === 0 ? `<text x="260" y="90" text-anchor="middle" font-size="14" fill="#4d5a50">No fossil groups visible in this sample</text>` : '';
    return `<svg class="diagram-svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="dtitle-${selectedLayerIndex} ddesc-${selectedLayerIndex}">
      <title id="dtitle-${selectedLayerIndex}">Fossil diagram for ${esc(layer.name)}</title>
      <desc id="ddesc-${selectedLayerIndex}">${esc(layer.annotation)} Abundance appears ${esc(layer.abundanceLabel)}; diversity appears ${esc(layer.diversityLabel)}.</desc>
      <rect x="0" y="0" width="${w}" height="${h}" fill="${bg}" />
      <g opacity="0.25" stroke="#5c4a2f">${rockTextureLines(w,h)}</g>
      ${icons}${emptyNote}
      <rect x="8" y="8" rx="6" ry="6" width="250" height="26" fill="rgba(255,253,248,0.85)" stroke="#bba982" />
      <text x="16" y="26" font-size="12" fill="#1f2a1f">Annotated sample diagram (not exact counts)</text>
    </svg>`;
  }

  function rockTextureLines(w,h) {
    let s = '';
    for (let y=18; y<h; y+=16) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y+3}" />`;
    for (let i=0; i<10; i++) s += `<circle cx="${30+i*52}" cy="${20+(i%3)*45}" r="${3+(i%3)}" fill="#6b5430" stroke="none" opacity="0.2" />`;
    return s;
  }
  function shortName(name) { return name.length > 11 ? name.slice(0, 10) + '…' : name; }
  function svgFossil(icon, x, y, color) {
    const stroke = '#2f2a20';
    switch (icon) {
      case 'spiral': return `<path d="M ${x} ${y} c 8 0 10 10 2 12 c -8 2 -12 -8 -4 -12 c 6 -3 12 2 10 8" fill="none" stroke="${color}" stroke-width="3" />`;
      case 'fan': return `<path d="M ${x} ${y+10} L ${x-10} ${y-8} M ${x} ${y+10} L ${x} ${y-10} M ${x} ${y+10} L ${x+10} ${y-8}" stroke="${color}" stroke-width="3" fill="none" /><path d="M ${x-10} ${y-8} Q ${x} ${y-14} ${x+10} ${y-8}" stroke="${color}" stroke-width="2" fill="none"/>`;
      case 'oval': return `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="${color}" opacity="0.85" stroke="${stroke}" stroke-width="1" />`;
      case 'clam': return `<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${color}" opacity="0.85" stroke="${stroke}" /><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="#fff" opacity="0.5"/>`;
      case 'mat': return `<rect x="${x-10}" y="${y-5}" width="20" height="10" rx="3" fill="${color}" opacity="0.8" stroke="${stroke}" />`;
      case 'leaf': return `<path d="M ${x} ${y-10} Q ${x+10} ${y} ${x} ${y+10} Q ${x-10} ${y} ${x} ${y-10}" fill="${color}" opacity="0.8" stroke="${stroke}"/>`;
      case 'plate': return `<rect x="${x-9}" y="${y-7}" width="18" height="14" rx="2" fill="${color}" opacity="0.85" stroke="${stroke}"/><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="#fff" opacity="0.4"/>`;
      case 'sail': return `<path d="M ${x-8} ${y+8} L ${x} ${y-10} L ${x+10} ${y+8} Z" fill="${color}" opacity="0.85" stroke="${stroke}"/>`;
      case 'tube': return `<rect x="${x-4}" y="${y-10}" width="8" height="20" rx="4" fill="${color}" opacity="0.85" stroke="${stroke}"/>`;
      case 'seed': return `<circle cx="${x}" cy="${y}" r="7" fill="${color}" opacity="0.85" stroke="${stroke}"/><circle cx="${x+3}" cy="${y-2}" r="2" fill="#fff" opacity="0.5"/>`;
      case 'coil': return `<path d="M ${x-8} ${y} q 4 -8 8 0 q 4 8 8 0" fill="none" stroke="${color}" stroke-width="3"/>`;
      case 'ridge': return `<path d="M ${x-10} ${y+4} q 10 -14 20 0" fill="${color}" opacity="0.75" stroke="${stroke}"/>`;
      case 'float': return `<circle cx="${x}" cy="${y}" r="8" fill="${color}" opacity="0.7" stroke="${stroke}"/><path d="M ${x-6} ${y+6} l -3 6 M ${x} ${y+8} l 0 6 M ${x+6} ${y+6} l 3 6" stroke="${color}" stroke-width="2"/>`;
      case 'spine': return `<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="${color}" opacity="0.85" stroke="${stroke}"/><path d="M ${x-8} ${y} l -4 -4 M ${x} ${y-5} l 0 -5 M ${x+8} ${y} l 4 -4" stroke="${stroke}"/>`;
      case 'dust': return `<path d="M ${x-10} ${y} q 5 -8 10 0 t 10 0" fill="none" stroke="${color}" stroke-width="3"/>`;
      case 'wing': return `<ellipse cx="${x-4}" cy="${y}" rx="6" ry="3" fill="${color}" opacity="0.8"/><ellipse cx="${x+4}" cy="${y}" rx="6" ry="3" fill="${color}" opacity="0.8"/><line x1="${x}" y1="${y-4}" x2="${x}" y2="${y+5}" stroke="${stroke}"/>`;
      case 'beetle': return `<ellipse cx="${x}" cy="${y}" rx="7" ry="9" fill="${color}" opacity="0.85" stroke="${stroke}"/><line x1="${x}" y1="${y-9}" x2="${x}" y2="${y+9}" stroke="#fff" opacity="0.4"/>`;
      case 'burrow': return `<path d="M ${x-10} ${y+6} q 10 -16 20 0" fill="none" stroke="${color}" stroke-width="4"/><circle cx="${x}" cy="${y+4}" r="3" fill="${color}"/>`;
      case 'snail': return `<path d="M ${x-8} ${y+4} q 10 -12 16 0" fill="${color}" opacity="0.8" stroke="${stroke}"/><circle cx="${x-2}" cy="${y-1}" r="4" fill="none" stroke="${stroke}"/>`;
      case 'ribbon': return `<path d="M ${x-10} ${y} q 5 -8 10 0 t 10 0 t -10 8 t -10 0" fill="none" stroke="${color}" stroke-width="3"/>`;
      case 'fin': return `<path d="M ${x-10} ${y} q 10 -6 20 0 q -10 6 -20 0" fill="${color}" opacity="0.85" stroke="${stroke}"/><path d="M ${x+8} ${y} l 5 -4 l 0 8 z" fill="${color}" stroke="${stroke}"/>`;
      case 'crawler': return `<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="${color}" opacity="0.85" stroke="${stroke}"/><path d="M ${x-6} ${y+4} l -2 4 M ${x} ${y+5} l 0 4 M ${x+6} ${y+4} l 2 4" stroke="${stroke}"/>`;
      case 'reed': return `<line x1="${x}" y1="${y+10}" x2="${x}" y2="${y-10}" stroke="${color}" stroke-width="3"/><path d="M ${x} ${y-4} q 8 -4 6 -10" fill="none" stroke="${color}" stroke-width="2"/>`;
      default: return `<circle cx="${x}" cy="${y}" r="8" fill="${color}" opacity="0.8" stroke="${stroke}"/>`;
    }
  }

  function renderBoundaryChoices() {
    const eco = currentEcosystem;
    els['boundary-choices'].innerHTML = eco.layers.slice(0, -1).map((layer, i) => {
      const label = formatBoundaryChoice(i, eco);
      const selected = selectedBoundaryChoice === i;
      const correctChoice = eco.correctBoundaryChoices.includes(i);
      let cls = 'boundary-btn';
      let statusText = 'Tap to mark this boundary';
      if (boundaryResolved) {
        if (correctChoice) { cls += ' correct'; statusText = 'Correct/revealed boundary evidence'; }
        else if (selected) { cls += ' incorrect'; statusText = 'Your marked choice'; }
        else { statusText = 'Other boundary'; }
      } else if (selected) {
        cls += ' selected';
        statusText = 'Your current marked choice';
      }
      const disabled = boundaryResolved ? 'disabled' : '';
      const pressed = selected ? 'true' : 'false';
      return `<button type="button" class="${cls}" data-index="${i}" aria-pressed="${pressed}" ${disabled}><span>${esc(label)}</span><br><span class="layer-meta">${esc(statusText)}</span></button>`;
    }).join('');
    els['boundary-choices'].querySelectorAll('.boundary-btn').forEach(btn => {
      btn.addEventListener('click', () => onBoundaryChoice(Number(btn.dataset.index)));
    });
    renderAttemptStatus();
  }

  function renderAttemptStatus() {
    const remaining = Math.max(0, MAX_ATTEMPTS - boundaryAttempts);
    if (boundaryResolved && boundaryAttempts >= MAX_ATTEMPTS && !isCorrectChoice(selectedBoundaryChoice)) {
      els['attempt-status'].textContent = `Attempts used: ${boundaryAttempts} of ${MAX_ATTEMPTS}. Correct answer revealed.`;
    } else if (boundaryResolved) {
      els['attempt-status'].textContent = `Boundary identified after ${boundaryAttempts} attempt${boundaryAttempts === 1 ? '' : 's'}.`;
    } else {
      els['attempt-status'].textContent = `Attempts: ${boundaryAttempts} of ${MAX_ATTEMPTS} used. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`;
    }
  }

  function isCorrectChoice(i) {
    return i !== null && currentEcosystem.correctBoundaryChoices.includes(i);
  }

  function onBoundaryChoice(index) {
    if (boundaryResolved) return;
    selectedBoundaryChoice = index;
    boundaryAttempts += 1;
    const eco = currentEcosystem;
    const correct = eco.correctBoundaryChoices.includes(index);
    const uncertain = eco.correctBoundaryChoices.length > 1;

    if (correct) {
      boundaryResolved = true;
      const prefix = uncertain ? 'Good choice. The evidence supports an uncertain boundary in this area.' : 'Good choice. This is the clearest boundary supported by the diagrams.';
      setBoundaryFeedback(prefix + ' ' + eco.boundaryExplanation, 'good');
    } else if (boundaryAttempts >= MAX_ATTEMPTS) {
      boundaryResolved = true;
      setBoundaryFeedback('The correct answer is now revealed. ' + eco.boundaryExplanation, 'warn');
    } else {
      const remaining = MAX_ATTEMPTS - boundaryAttempts;
      setBoundaryFeedback(`Not the best-supported location yet. Compare the layer annotations for changes in abundance and diversity, then try again. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`, 'info');
    }
    renderBoundaryChoices();
    renderLayerList();
    renderAttemptStatus();
    updateSceneBoundary();
  }

  function setBoundaryFeedback(msg, type) {
    els['boundary-feedback'].className = 'feedback ' + (type || 'info');
    els['boundary-feedback'].textContent = msg || '';
  }
  function factorSensitivity(factorId) {
    switch (factorId) {
      case 'temperature': return { rateMul: 1.0, sevMul: 1.0 };
      case 'seaLevel': return { rateMul: 0.95, sevMul: 1.05 };
      case 'oxygen': return { rateMul: 1.05, sevMul: 1.1 };
      case 'rainfall': return { rateMul: 1.0, sevMul: 0.95 };
      case 'volcanicAsh': return { rateMul: 1.1, sevMul: 1.1 };
      default: return { rateMul: 1.0, sevMul: 1.0 };
    }
  }

  function appliedStressAtStep(rate, severity, step, factorId) {
    const sens = factorSensitivity(factorId);
    const effRate = clamp(rate * sens.rateMul, 0, 120);
    const effSeverity = clamp(severity * sens.sevMul, 0, 120);
    const speed = 0.35 + (effRate / 100) * 1.25;
    return Math.min(effSeverity, effSeverity * step * speed / 3.2);
  }

  function runSimulationModel(eco, factorId, rate, severity) {
    const alive = {};
    eco.species.forEach(sp => { alive[sp.id] = true; });
    const timeline = [];
    const generatedLayers = [];
    for (let step = 1; step <= SIM_STEPS; step++) {
      const stress = appliedStressAtStep(rate, severity, step, factorId);
      eco.species.forEach(sp => {
        if (!alive[sp.id]) return;
        const rateShock = (rate * factorSensitivity(factorId).rateMul) > sp.rateTol;
        const severityShock = stress > sp.sevTol;
        if (rateShock || severityShock) alive[sp.id] = false;
      });
      const fossils = {};
      let diversity = 0, abundance = 0;
      eco.species.forEach(sp => {
        const c = alive[sp.id] ? sp.base : 0;
        fossils[sp.id] = c;
        abundance += c;
        if (c > 0) diversity += 1;
      });
      timeline.push({ step, stress: Math.round(stress), diversity, abundance });
      generatedLayers.push({
        name: `Result layer R${step}`,
        age: `After change, stage ${step}`,
        abundanceLabel: abundance === 0 ? 'none' : abundance <= 4 ? 'low' : abundance <= 8 ? 'medium' : 'high',
        diversityLabel: diversity === 0 ? 'none' : diversity <= 2 ? 'low' : diversity <= 3 ? 'medium' : 'high',
        summary: 'Layer formed from the simulated outcome at this stage.',
        annotation: diversity === 0 ? 'No fossil groups remain in this simulated sample.' : `Simulated evidence shows ${diversity} species group${diversity === 1 ? '' : 's'} persisting at this stage.`,
        fossils,
        simulated: true
      });
    }
    const survival = eco.species.map(sp => ({
      ...sp,
      survived: !!alive[sp.id],
      reason: alive[sp.id]
        ? `Persisted under ${FACTORS[factorId].label.toLowerCase()} in this run.`
        : explainLoss(sp, rate, severity, factorId)
    }));
    const startDiversity = eco.species.filter(sp => (eco.layers[Math.min(2, eco.layers.length - 1)].fossils[sp.id] || 0) > 0).length;
    return {
      ecosystemId: eco.id,
      ecosystemName: eco.name,
      factorId,
      factorLabel: FACTORS[factorId].label,
      rate, severity,
      rateText: rateDescriptor(rate),
      severityText: severityDescriptor(severity),
      timeline,
      generatedLayers,
      survival,
      startDiversity,
      finalDiversity: timeline[timeline.length - 1].diversity
    };
  }

  function explainLoss(sp, rate, severity, factorId) {
    const sens = factorSensitivity(factorId);
    const parts = [];
    if ((rate * sens.rateMul) > sp.rateTol) parts.push('the change happened too quickly for this group');
    if ((severity * sens.sevMul) > sp.sevTol) parts.push('the change became too severe for this group');
    if (!parts.length) parts.push('combined conditions exceeded this group\'s tolerance');
    return `Lost from later simulated samples because ${parts.join(' and ')} (${FACTORS[factorId].label.toLowerCase()}).`;
  }

  function clearVizTimer() {
    if (vizTimer) { clearInterval(vizTimer); vizTimer = null; }
  }

  function startVisualisation(run) {
    clearVizTimer();
    vizStep = 0;
    renderSimTimeline(0);
    renderVizFrame(run, 0);
    vizTimer = setInterval(() => {
      vizStep += 1;
      if (vizStep > SIM_STEPS) {
        clearVizTimer();
        renderSimTimeline(SIM_STEPS);
        els['viz-status'].textContent = `Visualisation complete for ${run.factorLabel} (${run.rateText}, ${run.severityText}). Resulting fossil layers and survival are shown below and added to comparisons.`;
        return;
      }
      renderVizFrame(run, vizStep);
    }, 900);
  }

  function renderVizFrame(run, step) {
    renderSimTimeline(step);
    const factor = FACTORS[run.factorId];
    const point = step === 0 ? { stress: 0, diversity: run.startDiversity, step: 0 } : run.timeline[step - 1];
    const pct = clamp(Math.round((point.stress / 120) * 100), 0, 100);
    const mix = clamp(pct / 100, 0, 1);
    const landscapeBg = mix < 0.5 ? factor.landscape.calm : factor.landscape.severe;
    const filter = `saturate(${1 - mix * 0.45}) brightness(${1 - mix * 0.18})`;
    const label = step === 0 ? 'Starting conditions' : `Stage ${step} of ${SIM_STEPS}`;
    const changeDesc = step === 0
      ? 'Landscape before major change: conditions are relatively stable.'
      : `Landscape responding to ${factor.label.toLowerCase()}: ${run.rateText.toLowerCase()}, ${run.severityText.toLowerCase()}.`;
    const bioPct = Math.round((point.diversity / Math.max(currentEcosystem.species.length, 1)) * 100);

    els['landscape-viz'].innerHTML = `
      <div class="viz-scene">
        <div class="viz-landscape-bar" style="background:${landscapeBg};filter:${filter}" role="img" aria-label="${esc(label)}. ${esc(changeDesc)} Indicator shows ${pct}% stress."></div>
        <p class="viz-caption"><strong>${esc(label)}:</strong> ${esc(changeDesc)}</p>
      </div>`;
    els['indicator-viz'].innerHTML = `
      <div class="indicators-grid">
        <div class="indicator-card">
          <span class="indicator-label">${esc(factor.indicatorLabel)}</span>
          <div class="indicator-bar" aria-hidden="true"><div class="indicator-fill" style="width:${pct}%"></div></div>
          <div class="indicator-value">${pct}% ${esc(factor.unit)} (annotated)</div>
        </div>
        <div class="indicator-card">
          <span class="indicator-label">Rate of change</span>
          <div class="indicator-bar" aria-hidden="true"><div class="indicator-fill" style="width:${run.rate}%"></div></div>
          <div class="indicator-value">${run.rate} — ${esc(run.rateText)}</div>
        </div>
        <div class="indicator-card">
          <span class="indicator-label">Severity of change</span>
          <div class="indicator-bar" aria-hidden="true"><div class="indicator-fill" style="width:${run.severity}%"></div></div>
          <div class="indicator-value">${run.severity} — ${esc(run.severityText)}</div>
        </div>
        <div class="indicator-card">
          <span class="indicator-label">Biodiversity in simulated sample</span>
          <div class="indicator-bar" aria-hidden="true"><div class="indicator-fill" style="width:${bioPct}%;background:linear-gradient(90deg,#6a8f63,#2f6b4f)"></div></div>
          <div class="indicator-value"><strong>${point.diversity}</strong> of ${currentEcosystem.species.length} species groups present (${bioPct}%)</div>
        </div>
      </div>`;
    if (step === 0) {
      els['viz-status'].textContent = 'Automatic visualisation starting: landscape, gauges, and timeline will update stage by stage.';
    } else {
      els['viz-status'].textContent = `Showing stage ${step} of ${SIM_STEPS}: ${factor.indicatorLabel.toLowerCase()} at ${pct}% with biodiversity ${point.diversity} of ${currentEcosystem.species.length}.`;
    }
  }

  function renderLatestResult(run) {
    if (!run) {
      els['latest-result'].innerHTML = '<p class="empty-state">Run an automatic visualisation to see survival, biodiversity, and resulting fossil layers.</p>';
      return;
    }
    els['latest-result'].innerHTML = `
      ${renderSurvivalList(run)}
      ${renderGraph(run)}
      <h4>Resulting fossil layers</h4>
      ${renderMiniLayers(run.generatedLayers)}
    `;
  }

  function renderSurvivalList(run) {
    const total = Math.max(run.survival.length, 1);
    const survived = run.survival.filter(sp => sp.survived).length;
    const pct = Math.round((survived / total) * 100);
    const items = run.survival.map(sp => `<li class="species-item ${sp.survived ? 'survived' : 'lost'}">
      <span class="swatch" style="background:${sp.color}"></span>
      <div><div><strong>${esc(sp.name)}</strong> — <span class="status">${sp.survived ? 'Survived ✓' : 'Lost ✕'}</span></div>
      <div class="panel-help">${esc(sp.reason)}</div></div>
    </li>`).join('');
    return `<p><strong>Run settings:</strong> <span class="tag">${esc(run.factorLabel)}</span> ${esc(run.rateText)} (rate ${run.rate}), ${esc(run.severityText)} (severity ${run.severity}).</p>
      <div class="compare-visuals">
        <div><strong>Survival indicator:</strong> ${survived} of ${total} species groups (${pct}%)</div>
        <div class="indicator-bar" aria-hidden="true"><div class="indicator-fill" style="width:${pct}%;background:linear-gradient(90deg,#6a8f63,#2f6b4f)"></div></div>
      </div>
      <ul class="species-list">${items}</ul>`;
  }

  function renderGraph(run) {
    const points = [{ step: 0, label: 'Start', diversity: run.startDiversity }].concat(run.timeline.map(t => ({ step: t.step, label: 'R' + t.step, diversity: t.diversity })));
    const maxD = Math.max(currentEcosystem.species.length, 1);
    const w = 520, h = 240, padL = 46, padR = 18, padT = 16, padB = 42;
    const plotW = w - padL - padR, plotH = h - padT - padB;
    const x = i => padL + (i / (points.length - 1)) * plotW;
    const y = v => padT + plotH - (v / maxD) * plotH;
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.diversity).toFixed(1)}`).join(' ');
    const dots = points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.diversity)}" r="4.5" fill="#2f6b4f"><title>${esc(p.label)}: diversity ${p.diversity}</title></circle>`).join('');
    const xLabels = points.map((p, i) => `<text x="${x(i)}" y="${h - 16}" text-anchor="middle" font-size="12" fill="#1f2a1f">${esc(p.label)}</text>`).join('');
    let yTicks = '';
    for (let v = 0; v <= maxD; v++) {
      const yy = y(v);
      yTicks += `<line x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" stroke="#ddd2ba" />`;
      yTicks += `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="12" fill="#1f2a1f">${v}</text>`;
    }
    const desc = `Biodiversity starts at ${run.startDiversity} and ends at ${run.finalDiversity} species groups.`;
    return `<h4>Biodiversity over time</h4>
      <div class="graph-wrap"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Biodiversity over time graph. ${esc(desc)}">
        ${yTicks}
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h - padB}" stroke="#4d5a50" />
        <line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="#4d5a50" />
        <path d="${line}" fill="none" stroke="#2f6b4f" stroke-width="3" />
        ${dots}
        ${xLabels}
      </svg></div>
      <p class="panel-help">${esc(desc)} Values are based on the same underlying scenario data as the visualisation and layers.</p>`;
  }

  function renderMiniLayers(layers) {
    const shown = layers.slice().reverse();
    return `<div class="mini-layer-stack">${shown.map(l => {
      const stats = layerStats(l, currentEcosystem);
      const present = currentEcosystem.species.filter(sp => (l.fossils[sp.id] || 0) > 0).map(sp => sp.name);
      const list = present.length ? esc(present.join(', ')) : 'No fossil groups visible';
      const ab = levelScore(l.abundanceLabel), dv = levelScore(l.diversityLabel);
      return `<div class="mini-layer">
        <strong>${esc(l.name)}</strong>
        <div class="mini-bars">
          <div class="mini-bar-row"><span>Abundance</span><div class="meter-track" aria-hidden="true"><div class="meter-fill" style="width:${ab}%"></div></div><span>${esc(l.abundanceLabel)}</span></div>
          <div class="mini-bar-row"><span>Diversity</span><div class="meter-track" aria-hidden="true"><div class="meter-fill" style="width:${dv}%"></div></div><span>${stats.diversity} groups</span></div>
        </div>
        <div class="layer-meta">${list}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function renderComparison() {
    if (!runHistory.length) {
      els['run-comparison'].innerHTML = '<p class="empty-state">No saved runs yet. Run a simulation to compare results side by side on this visual board. Results are cleared when you reset or close the page.</p>';
      return;
    }
    els['run-comparison'].innerHTML = runHistory.map((entry, i) => {
      const run = entry.result;
      const total = currentEcosystem.species.length;
      const survived = run.finalDiversity;
      const pct = Math.round((survived / Math.max(total, 1)) * 100);
      const survivalBars = run.survival.map(sp => `<div class="mini-bar-row"><span>${esc(shortName(sp.name))}</span><div class="meter-track" aria-hidden="true"><div class="meter-fill" style="width:${sp.survived ? 100 : 15}%;${sp.survived ? '' : 'background:linear-gradient(90deg,#b97a7a,#8a2432);'}"></div></div><span>${sp.survived ? 'survived' : 'lost'}</span></div>`).join('');
      return `<article class="run-card" aria-label="Run ${i + 1}">
        <h3>Run ${i + 1}: ${esc(run.factorLabel)}</h3>
        <p class="run-meta"><strong>Ecosystem:</strong> ${esc(run.ecosystemName)}</p>
        <p class="run-meta"><strong>Settings:</strong> rate ${run.rate} (${esc(run.rateText)}), severity ${run.severity} (${esc(run.severityText)})</p>
        <div class="compare-visuals">
          <div><strong>Survival indicator:</strong> ${survived} of ${total} groups (${pct}%)</div>
          <div class="indicator-bar" aria-hidden="true"><div class="indicator-fill" style="width:${pct}%;background:linear-gradient(90deg,#6a8f63,#2f6b4f)"></div></div>
          <div class="mini-bars">${survivalBars}</div>
        </div>
        ${renderGraph(run)}
        <h4>Resulting fossil layer stack (visual)</h4>
        ${renderMiniLayers(run.generatedLayers)}
      </article>`;
    }).join('');
  }

  function onRunSimulation() {
    clearVizTimer();
    const rate = Number(els['rate-slider'].value);
    const severity = Number(els['severity-slider'].value);
    const factorId = selectedFactorId;
    const result = runSimulationModel(currentEcosystem, factorId, rate, severity);
    const entry = { id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), ecosystemId: currentEcosystem.id, ecosystemName: currentEcosystem.name, factorId, factorLabel: FACTORS[factorId].label, rate, severity, result };
    runHistory.push(entry);
    renderLatestResult(result);
    renderComparison();
    startVisualisation(result);
  }

  function updateSliderLabels() {
    const r = Number(els['rate-slider'].value);
    const s = Number(els['severity-slider'].value);
    els['rate-value'].textContent = r;
    els['severity-value'].textContent = s;
    els['rate-label'].textContent = rateDescriptor(r);
    els['severity-label'].textContent = severityDescriptor(s);
    if (els['rate-gauge']) els['rate-gauge'].style.width = r + '%';
    if (els['severity-gauge']) els['severity-gauge'].style.width = s + '%';
  }

  function renderSimTimeline(activeStep) {
    if (!els['sim-timeline']) return;
    if (activeStep == null) {
      els['sim-timeline'].innerHTML = '<p class="empty-state">Run a simulation to see the stage-by-stage visual timeline.</p>';
      return;
    }
    const steps = [{ n: 0, label: 'Start' }].concat(Array.from({ length: SIM_STEPS }, (_, i) => ({ n: i + 1, label: `Stage ${i + 1}` })));
    els['sim-timeline'].innerHTML = steps.map(s => {
      let cls = 'timeline-step';
      if (s.n === activeStep) cls += ' active';
      else if (s.n < activeStep) cls += ' done';
      const marker = s.n < activeStep ? '✓ ' : (s.n === activeStep ? '▶ ' : '');
      return `<div class="${cls}" aria-label="${marker}${esc(s.label)}${s.n === activeStep ? ' (current)' : ''}">${marker}${esc(s.label)}</div>`;
    }).join('');
  }

  function resetAll() {
    clearVizTimer();
    runHistory = [];
    boundaryAttempts = 0;
    boundaryResolved = false;
    selectedBoundaryChoice = null;
    selectedLayerIndex = 0;
    els['rate-slider'].value = 35;
    els['severity-slider'].value = 40;
    updateSliderLabels();
    const eco = currentEcosystem;
    selectedFactorId = eco.defaultFactor;
    if (els['factor-select']) els['factor-select'].value = selectedFactorId;
    updateFactorDescription();
    setBoundaryFeedback('Boundary attempts and simulation results have been cleared for this ecosystem.', 'info');
    els['landscape-viz'].innerHTML = '<p class="empty-state">Run an automatic visualisation to see the changing landscape.</p>';
    els['indicator-viz'].innerHTML = '';
    els['viz-status'].textContent = '';
    renderSimTimeline(null);
    renderLatestResult(null);
    renderBoundaryChoices();
    renderLayerList();
    renderLayerDetails();
    renderComparison();
    updateScene();
  }

  function renderAll() {
    renderLayerList();
    renderLayerDetails();
    if (!boundaryResolved && boundaryAttempts === 0) {
      setBoundaryFeedback('Tap or click a boundary location to make your first inference.', 'info');
    } else if (boundaryResolved) {
      if (isCorrectChoice(selectedBoundaryChoice)) setBoundaryFeedback((currentEcosystem.correctBoundaryChoices.length > 1 ? 'Good choice. The evidence supports an uncertain boundary in this area. ' : 'Good choice. This is the clearest boundary supported by the diagrams. ') + currentEcosystem.boundaryExplanation, 'good');
      else setBoundaryFeedback('The correct answer is now revealed. ' + currentEcosystem.boundaryExplanation, 'warn');
    }
    renderAttemptStatus();
    renderBoundaryChoices();
    if (!els['landscape-viz'].innerHTML) els['landscape-viz'].innerHTML = '<p class="empty-state">Run an automatic visualisation to see the changing landscape.</p>';
    if (els['sim-timeline'] && !els['sim-timeline'].innerHTML) renderSimTimeline(null);
    renderLatestResult(runHistory.length ? runHistory[runHistory.length - 1].result : null);
    renderComparison();
    updateSliderLabels();
    updateScene();
  }

  function initScene() {
    if (typeof THREE === 'undefined') {
      els['three-root'].innerHTML = '<p class="panel-help" style="padding:1rem">3D view could not load. Use the layer diagrams and boundary buttons below — all essential information is provided there.</p>';
      return;
    }
    const container = els['three-root'];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce9f5);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(7.2, 5.2, 8.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dir = new THREE.DirectionalLight(0xfff4dd, 0.9);
    dir.position.set(6, 10, 6);
    scene.add(dir);
    const root = new THREE.Group();
    scene.add(root);
    sceneState = {
      container, scene, camera, renderer, root,
      layerMeshes: [], boundaryMesh: null,
      targetRotX: -0.35, targetRotY: 0.55, rotX: -0.35, rotY: 0.55,
      targetZoom: 1, zoom: 1, dragging: false, lastX: 0, lastY: 0, pinchDist: null
    };
    setupSceneControls(sceneState);
    resizeScene();
    updateScene();
    animate();
    window.addEventListener('resize', resizeScene);
  }

  function setupSceneControls(state) {
    const el = state.container;
    el.tabIndex = 0;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', '3D rock cross-section. Use layer buttons and diagrams below for full details.');
    const onDown = (x, y) => { state.dragging = true; state.lastX = x; state.lastY = y; };
    const onMove = (x, y) => {
      if (!state.dragging) return;
      const dx = x - state.lastX, dy = y - state.lastY;
      state.lastX = x; state.lastY = y;
      state.targetRotY += dx * 0.01;
      state.targetRotX = clamp(state.targetRotX + dy * 0.01, -1.2, 0.6);
    };
    const onUp = () => { state.dragging = false; state.pinchDist = null; };
    el.addEventListener('mousedown', e => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);
    el.addEventListener('wheel', e => { e.preventDefault(); state.targetZoom = clamp(state.targetZoom * (e.deltaY > 0 ? 1.08 : 0.92), 0.6, 2.2); }, { passive: false });
    const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    el.addEventListener('touchstart', e => {
      if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
      else if (e.touches.length === 2) state.pinchDist = dist(e.touches);
    }, { passive: true });
    el.addEventListener('touchmove', e => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
      else if (e.touches.length === 2) {
        const d = dist(e.touches);
        if (state.pinchDist) state.targetZoom = clamp(state.targetZoom * (state.pinchDist / d), 0.6, 2.2);
        state.pinchDist = d;
      }
    }, { passive: true });
    el.addEventListener('touchend', onUp);
    el.addEventListener('keydown', e => {
      const step = 0.08;
      if (e.key === 'ArrowLeft') state.targetRotY -= step;
      else if (e.key === 'ArrowRight') state.targetRotY += step;
      else if (e.key === 'ArrowUp') state.targetRotX -= step;
      else if (e.key === 'ArrowDown') state.targetRotX += step;
      else if (e.key === '+' || e.key === '=') state.targetZoom *= 0.92;
      else if (e.key === '-' || e.key === '_') state.targetZoom *= 1.08;
      else return;
      e.preventDefault();
      state.targetRotX = clamp(state.targetRotX, -1.2, 0.6);
      state.targetZoom = clamp(state.targetZoom, 0.6, 2.2);
    });
  }

  function resizeScene() {
    if (!sceneState) return;
    const { container, camera, renderer } = sceneState;
    const w = container.clientWidth || 300, h = container.clientHeight || 240;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function clearGroup(group) {
    while (group.children.length) {
      const obj = group.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose());
    }
  }

  function updateScene() {
    if (!sceneState) return;
    const eco = currentEcosystem;
    const layers = eco.layers;
    clearGroup(sceneState.root);
    sceneState.layerMeshes = [];
    const thickness = 0.7, gap = 0.05, width = 5.4, depth = 3.3;
    const totalH = layers.length * (thickness + gap);
    const baseY = -totalH / 2;
    const rockPalette = [0xc8b79a, 0xb7a281, 0xd6c6aa, 0xa99574, 0xcdbd97, 0xbfae8f];
    layers.forEach((layer, i) => {
      const y = baseY + i * (thickness + gap) + thickness / 2;
      const geom = new THREE.BoxGeometry(width, thickness, depth);
      const mat = new THREE.MeshStandardMaterial({ color: rockPalette[i % rockPalette.length], roughness: 0.95, metalness: 0.02 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0, y, 0);
      sceneState.root.add(mesh);
      sceneState.layerMeshes.push(mesh);
      addFossilMarkers(sceneState.root, layer, eco, y, thickness, width, depth, i);
    });
    updateSceneBoundary();
    updateSceneSelection();
  }

  function addFossilMarkers(root, layer, eco, y, thickness, width, depth, layerIndex) {
    const present = eco.species.filter(sp => (layer.fossils[sp.id] || 0) > 0);
    present.forEach((sp, i) => {
      const count = layer.fossils[sp.id] || 0;
      const markers = Math.max(1, Math.min(3, Math.round((count / (sp.base || 1)) * 2.2)));
      for (let k = 0; k < markers; k++) {
        const size = 0.11;
        let geom;
        switch (sp.icon) {
          case 'fan': case 'leaf': case 'reed': case 'ribbon': geom = new THREE.BoxGeometry(size*1.6, size*0.4, size*1.2); break;
          case 'tube': case 'burrow': geom = new THREE.CylinderGeometry(size*0.5, size*0.5, size*1.6, 6); break;
          case 'sail': case 'coil': geom = new THREE.ConeGeometry(size, size*1.5, 5); break;
          default: geom = new THREE.SphereGeometry(size*0.9, 8, 6);
        }
        const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(sp.color), roughness: 0.6 });
        const m = new THREE.Mesh(geom, mat);
        const px = -width/2 + 0.7 + (i * 1.0) + (k * 0.22);
        const pz = -depth/2 + 0.7 + ((i + k + layerIndex) % 3) * 0.9;
        m.position.set(clamp(px, -width/2 + 0.4, width/2 - 0.4), y + thickness/2 + 0.1, clamp(pz, -depth/2 + 0.4, depth/2 - 0.4));
        m.rotation.y = (i + k) * 0.7;
        root.add(m);
      }
    });
  }

  function updateSceneSelection() {
    if (!sceneState) return;
    sceneState.layerMeshes.forEach((mesh, i) => {
      const selected = i === selectedLayerIndex;
      mesh.material.emissive = new THREE.Color(selected ? 0x5a4a00 : 0x000000);
      mesh.material.emissiveIntensity = selected ? 0.22 : 0;
    });
  }

  function updateSceneBoundary() {
    if (!sceneState) return;
    if (sceneState.boundaryMesh) {
      sceneState.root.remove(sceneState.boundaryMesh);
      if (sceneState.boundaryMesh.geometry) sceneState.boundaryMesh.geometry.dispose();
      if (sceneState.boundaryMesh.material) sceneState.boundaryMesh.material.dispose();
      sceneState.boundaryMesh = null;
    }
    if (selectedBoundaryChoice === null) return;
    const layers = currentEcosystem.layers;
    const idx = selectedBoundaryChoice;
    if (idx < 0 || idx >= layers.length - 1) return;
    const thickness = 0.7, gap = 0.05, width = 5.4, depth = 3.3;
    const totalH = layers.length * (thickness + gap);
    const baseY = -totalH / 2;
    const yBelow = baseY + idx * (thickness + gap) + thickness / 2;
    const y = yBelow + thickness / 2 + gap / 2;
    const correct = currentEcosystem.correctBoundaryChoices.includes(idx);
    const color = boundaryResolved ? (correct ? 0x2f855a : 0xc05621) : 0xd97706;
    const geom = new THREE.BoxGeometry(width + 0.15, 0.045, depth + 0.15);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(0, y, 0);
    sceneState.root.add(mesh);
    sceneState.boundaryMesh = mesh;
  }

  function animate() {
    if (!sceneState) return;
    requestAnimationFrame(animate);
    const s = sceneState;
    s.rotX += (s.targetRotX - s.rotX) * 0.12;
    s.rotY += (s.targetRotY - s.rotY) * 0.12;
    s.zoom += (s.targetZoom - s.zoom) * 0.12;
    s.root.rotation.x = s.rotX;
    s.root.rotation.y = s.rotY;
    s.camera.position.set(7.2 / s.zoom, 5.2 / s.zoom, 8.2 / s.zoom);
    s.camera.lookAt(0, 0, 0);
    s.renderer.render(s.scene, s.camera);
  }

  function bindEvents() {
    els['reset-all'].addEventListener('click', resetAll);
    els['factor-select'].addEventListener('change', () => {
      selectedFactorId = els['factor-select'].value;
      updateFactorDescription();
    });
    els['rate-slider'].addEventListener('input', updateSliderLabels);
    els['severity-slider'].addEventListener('input', updateSliderLabels);
    els['run-simulation'].addEventListener('click', onRunSimulation);
    window.addEventListener('beforeunload', () => { runHistory = []; });
  }

  function init() {
    cacheEls();
    initEcosystemSelect();
    bindEvents();
    renderSimTimeline(null);
    setEcosystem(ECOSYSTEMS[0]);
    els['landscape-viz'].innerHTML = '<p class="empty-state">Run an automatic visualisation to see the changing landscape.</p>';
    renderLatestResult(null);
    initScene();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
