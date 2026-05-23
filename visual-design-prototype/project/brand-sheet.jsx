// brand-sheet.jsx — unified identity sheet
// Documents the system: wordmark, both palettes (light/dark always shown),
// type, the diagram primitives, interactive controls.
// A theme toggle in the corner switches the rest of the sheet.

function BrandSheet() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: theme.paper, color: theme.ink,
        fontFamily: lmSerif, padding: '52px 60px',
        display: 'grid', gridTemplateRows: 'auto 1fr', rowGap: 36,
        position: 'relative',
        transition: 'background 0.4s, color 0.4s',
      }}
    >
      <ThemeToggle style={{ position: 'absolute', top: 28, right: 28 }} />

      {/* Header */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', borderBottom: `1px solid ${theme.inkFaint}`, paddingBottom: 24 }}>
        <div>
          <Kicker style={{ marginBottom: 14 }}>00 — identity</Kicker>
          <Wordmark size={84} />
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <span style={{ fontFamily: lmSerif, fontStyle: 'italic', fontSize: 21, color: theme.ink, opacity: 0.78 }}>
              the geometry of relativity, by hand.
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Kicker opacity={0.7}>lightmatters.app</Kicker>
          <Kicker opacity={0.4} style={{ marginTop: 6, fontSize: 9.5 }}>v0.1 — brand sheet</Kicker>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56, alignContent: 'start' }}>
        {/* LEFT */}
        <section>
          <SectionRule num="I" title="wordmark" />
          <div
            style={{
              padding: '34px 28px', marginBottom: 36,
              background: theme.paperAlt,
              transition: 'background 0.4s',
            }}
          >
            <Wordmark size={56} />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ height: 1, width: 36, background: theme.ink, opacity: 0.4 }} />
              <Kicker>signal · ch. & step · v / c</Kicker>
            </div>
            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <Kicker opacity={0.55} style={{ marginBottom: 8 }}>condensed</Kicker>
                <div style={{ fontFamily: lmSerif, fontSize: 22, color: theme.ink, lineHeight: 1 }}>
                  Light Matters<span style={{ color: theme.accent1 }}>.</span>
                </div>
              </div>
              <div>
                <Kicker opacity={0.55} style={{ marginBottom: 8 }}>monogram</Kicker>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: lmSerif, fontSize: 22, color: theme.ink, lineHeight: 1 }}>L</span>
                  <span style={{ fontFamily: lmSerif, fontSize: 22, color: theme.ink, lineHeight: 1, fontStyle: 'italic' }}>m</span>
                  <span style={{ color: theme.accent1 }}>·</span>
                </div>
              </div>
            </div>
          </div>

          <SectionRule num="II" title="palette" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, marginBottom: 36 }}>
            <div>
              <Kicker opacity={0.55} style={{ marginBottom: 14 }}>light mode</Kicker>
              <div style={{ display: 'grid', rowGap: 14 }}>
                <Swatch color="#f6f5f1" name="paper" code="#F6F5F1" />
                <Swatch color="#14141a" name="ink" code="#14141A" />
                <Swatch color="oklch(0.5 0.18 28)" name="vector · a" code="oklch(.5 .18 28)" />
                <Swatch color="oklch(0.46 0.16 252)" name="vector · b" code="oklch(.46 .16 252)" />
              </div>
            </div>
            <div>
              <Kicker opacity={0.55} style={{ marginBottom: 14 }}>dark mode</Kicker>
              <div style={{ display: 'grid', rowGap: 14 }}>
                <Swatch color="#0a0c11" name="night" code="#0A0C11" ring={theme.name === 'dark' ? theme.inkFaint : 'rgba(0,0,0,0.08)'} />
                <Swatch color="#ece4d6" name="ivory" code="#ECE4D6" />
                <Swatch color="oklch(0.76 0.13 28)" name="vector · a" code="oklch(.76 .13 28)" />
                <Swatch color="oklch(0.78 0.08 220)" name="vector · b" code="oklch(.78 .08 220)" />
              </div>
            </div>
          </div>

          <SectionRule num="III" title="type" />
          <TypeSpecimen
            displaySample="Aa"
            bodySample="A normalized velocity vector on the spacetime diagram. Pure time motion is rest; pure space motion is light; anywhere in between is us."
            labelSample="ch.02 · step 04 · v/c = 0.62"
          />
        </section>

        {/* RIGHT */}
        <section>
          <SectionRule num="IV" title="diagram primitives" />
          <div
            style={{
              padding: '20px 18px', marginBottom: 36,
              background: theme.paperAlt,
              transition: 'background 0.4s',
              display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 12, rowGap: 12,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <STDiagram width={250} height={220} variant="single" vectorStroke={1.8} />
              <Kicker opacity={0.6}>single vector</Kicker>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <STDiagram width={250} height={220} variant="pair" vectorStroke={1.8} />
              <Kicker opacity={0.6}>twin vectors</Kicker>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <STDiagram width={250} height={220} variant="wavefront" />
              <Kicker opacity={0.6}>wavefront</Kicker>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <STDiagram width={250} height={220} variant="cone" showLabels={false} showLight={false} />
              <Kicker opacity={0.6}>wireframe surface</Kicker>
            </div>
          </div>

          <SectionRule num="V" title="interactive elements glow" />
          <div
            style={{
              padding: '26px 28px', marginBottom: 36,
              background: theme.paperAlt,
              display: 'grid', rowGap: 22,
              transition: 'background 0.4s',
            }}
          >
            <Slider value={0.62} label="speed v/c" valueLabel="0.62" accent={theme.accent1} />
            <Slider value={0.18} label="curvature" valueLabel="0.18" accent={theme.accent2} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 6 }}>
              <Button>← back</Button>
              <Button primary>begin chapter 1</Button>
              <span style={{ flex: 1 }} />
              <Kicker opacity={0.5}>hover</Kicker>
            </div>
          </div>

          <SectionRule num="VI" title="aesthetic notes" />
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', rowGap: 12 }}>
            {[
              ['paper, both ways', 'one design, two skins — the dark mode is the night sky, the light mode is the page.'],
              ['glow on touch only', 'only things you can press or drag emit a halo — diagrams stay quiet linework.'],
              ['two-colour grammar', 'red for one body, blue for the other. Never decorative — always meaningful.'],
              ['serif always',  'EB Garamond reads at every size — mono only for axis labels and chapter marks.'],
            ].map(([term, def]) => (
              <li key={term} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', columnGap: 16, alignItems: 'baseline' }}>
                <Kicker opacity={0.75}>{term}</Kicker>
                <span style={{ fontFamily: lmSerif, fontSize: 14.5, lineHeight: 1.55, color: theme.ink, opacity: 0.8, textWrap: 'pretty' }}>{def}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

window.BrandSheet = BrandSheet;
