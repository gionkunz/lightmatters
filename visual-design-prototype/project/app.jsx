// app.jsx — wires the four surfaces into a single design canvas

function App() {
  return (
    <DesignCanvas>
      <DCSection id="identity" title="Identity" subtitle="The unified system — palette, type, primitives, controls. Toggle light / dark in the corner of any artboard.">
        <DCArtboard id="brand" label="Brand sheet · the unified system" width={1240} height={1480}>
          <BrandSheet />
        </DCArtboard>
      </DCSection>

      <DCSection id="marketing" title="Landing" subtitle="lightmatters.app — what new readers see first.">
        <DCArtboard id="landing" label="Landing page · hero, manifesto, chapters, CTA" width={1440} height={2400}>
          <Landing />
        </DCArtboard>
      </DCSection>

      <DCSection id="wayfinding" title="Wayfinding" subtitle="Table of contents as a worldline through the journey.">
        <DCArtboard id="index" label="Chapter index · the journey map" width={1640} height={1080}>
          <ChapterIndex />
        </DCArtboard>
      </DCSection>

      <DCSection id="step" title="The Step" subtitle="Three layouts for the engine's core surface — same primitives, different orchestration.">
        <DCArtboard id="step-intro" label="A · narrator on top · single vector" width={1440} height={900}>
          <StepIntro />
        </DCArtboard>
        <DCArtboard id="step-speed" label="B · chat feed + twin sliders" width={1440} height={900}>
          <StepSpeedBudget />
        </DCArtboard>
        <DCArtboard id="step-cone" label="C · diagram-first · narrator overlay" width={1440} height={900}>
          <StepCone />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
