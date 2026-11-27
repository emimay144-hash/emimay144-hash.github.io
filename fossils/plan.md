## Visual-first development plan

The tool will feature **five distinct fictional ecosystems**, each with at least five inspectable rock layers. Students learn by **reading visual evidence first**: realistic rock textures, fossil icons, colour-and-shape legends, and annotated diagrams show patterns in abundance and diversity without relying on exact counts. Text labels and annotations support the visuals so the meaning is clear on small screens and not dependent on colour alone.

### Visual student flow

1. **Choose an ecosystem from a visual card/selector**
   - Show a quick preview (ecosystem name, habitat scene cue, starting biodiversity, species/fossil legend with icons and colours/shapes).
2. **Inspect a visual strata column (all 5+ layers visible)**
   - Display layers as a stacked rock column (oldest at bottom, youngest at top) that students can tap/click.
   - For each layer, show a **fossil diagram**, **abundance meter/bar**, **diversity meter/bar**, and short annotation callouts.
   - Keep exact fossil counts secondary/internal; students compare “very low → very high” patterns and visible fossil variety.
3. **Mark the extinction boundary on the strata**
   - Students tap/click **between layer cards** on a visual boundary strip/timeline.
   - Selected, correct, incorrect, and revealed boundaries are shown with clear markers/icons and text feedback (not colour only).
   - Some scenarios show a **clear single boundary**; others show an **uncertain zone spanning several layers**.
   - Allow retries and **reveal the correct answer after 5 attempts** with a brief visual/text explanation.
4. **Set up a simulation with visual controls**
   - Choose an environmental factor (shown with icon/label and what it affects).
   - Adjust **rate** and **severity** with sliders that display plain-language levels and visual gauge fill.
5. **Watch an automatic visualisation**
   - A changing **landscape scene** updates over time.
   - Labelled **indicator gauges/bars** (factor stress, change rate, severity, biodiversity) animate step by step.
   - A **timeline/progress strip** shows simulation stages.
   - Annotations connect environmental change to species survival and to the **resulting fossil layers**.
6. **Compare runs side by side (visual comparison board)**
   - Place run cards/panels next to each other for the same ecosystem.
   - Compare settings, **survival indicators**, **biodiversity-over-time mini graphs**, and **resulting fossil layer stacks/diagrams**.
   - Keep results temporary: clear on **Reset** or when the page is closed.

### Scenario and simulation design

- **Five visually and biologically distinct ecosystems**, each with different starting biodiversity, species traits, and fossil patterns.
- At least **five inspectable layers per ecosystem**, each with a realistic rock look, diagram, and evidence annotation.
- Students choose an environmental factor, then adjust its **rate and severity**; outcomes update automatically.
- The **same underlying scenario data** drives the strata diagrams, simulation animation, indicators, survival results, biodiversity graph, and comparison views so they stay consistent.

### Interface and classroom use

- Use realistic rocks and fossils, but keep diagrams, labels, legends, and meters clean and readable on phones, tablets, and computers.
- Provide **touch-friendly tap targets** and a **prominent Reset button**.
- Keep essential information available in **text, icons, patterns, and annotations** (not only visual appearance or colour).
- Make every layer inspectable and show boundary/simulation states clearly.
- Keep all run results **temporary** (in-memory).

### Build order

1. Build a visual prototype for one ecosystem: stacked strata, fossil legend, layer diagrams, abundance/diversity meters, and boundary tap markers.
2. Add boundary feedback, retry logic, reveal after five attempts, and visual support for uncertain boundaries.
3. Add the other four ecosystems with distinct visuals, species traits, and fossil patterns.
4. Add environmental-factor controls and the automatic visualisation (landscape, gauges, timeline, resulting layers).
5. Add side-by-side visual comparison of survival, biodiversity, and fossil layers.
6. Test with students and refine visual clarity, annotations, instructions, reset behaviour, and mobile layout.

**Key design check:** Ask students to explain what **visual evidence** in the diagrams, meters, and layer comparisons led them to choose a boundary. That will show whether the visuals support inference rather than simply giving away the answer.