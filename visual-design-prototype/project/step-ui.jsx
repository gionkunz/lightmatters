// step-ui.jsx — three step layouts demonstrating the engine's range
//   StepIntro       — Ch 1 · narrator on top, diagram below, single slim control
//   StepSpeedBudget — Ch 2 · chat-feed narrator on the left, diagram + twin sliders on the right
//   StepCone        — Ch 3 · cinematic, diagram fills the screen, narrator overlaid at the bottom

// ─────────── shared step chrome ───────────
function StepFrame({ children, chapter, chapterTitle, step, stepsTotal, layout = 'top' }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: theme.paper, color: theme.ink,
        fontFamily: lmSerif, position: 'relative',
        display: 'grid', gridTemplateRows: 'auto 1fr auto',
        transition: 'background 0.4s, color 0.4s',
      }}
    >
      <StepNav chapter={chapter} chapterTitle={chapterTitle} step={step} stepsTotal={stepsTotal} />
      <main style={{ overflow: 'hidden' }}>{children}</main>
      <StepFooter />
    </div>
  );
}

function StepNav({ chapter, chapterTitle, step, stepsTotal }) {
  const { theme } = useTheme();
  return (
    <nav style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto',
      alignItems: 'center', columnGap: 28,
      padding: '20px 40px',
      borderBottom: `1px solid ${theme.inkFaint}`,
    }}>
      <Wordmark size={20} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Kicker opacity={0.45}>chapter {String(chapter).padStart(2, '0')}</Kicker>
        <span style={{ fontFamily: lmSerif, fontStyle: 'italic', fontSize: 17, color: theme.ink, opacity: 0.85 }}>{chapterTitle}</span>
      </div>
      <ProgressDots step={step} stepsTotal={stepsTotal} />
      <Kicker opacity={0.5}>{String(step).padStart(2, '0')} / {String(stepsTotal).padStart(2, '0')}</Kicker>
      <ThemeToggle />
    </nav>
  );
}

function ProgressDots({ step, stepsTotal }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: stepsTotal }).map((_, k) => {
        const filled = k < step - 1;
        const here = k === step - 1;
        return (
          <span key={k} style={{
            width: here ? 12 : 5, height: 5, borderRadius: 5,
            background: here ? theme.accent1 : (filled ? theme.ink : 'transparent'),
            border: `1px solid ${filled || here ? 'transparent' : theme.inkFaint}`,
            boxShadow: here ? `0 0 8px ${theme.glow1}` : 'none',
            transition: 'background 0.4s',
          }} />
        );
      })}
    </div>
  );
}

function StepFooter() {
  const { theme } = useTheme();
  return (
    <footer style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 40px',
      borderTop: `1px solid ${theme.inkFaint}`,
    }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <KeyHint k="←" label="back" />
        <KeyHint k="↩" label="skip reveal" />
        <KeyHint k="m" label="map" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Button>← previous</Button>
        <Button primary>continue →</Button>
      </div>
    </footer>
  );
}

function KeyHint({ k, label }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 22, height: 22, padding: '0 6px',
        border: `1px solid ${theme.inkFaint}`,
        fontFamily: lmMono, fontSize: 11, color: theme.ink, opacity: 0.7,
      }}>{k}</span>
      <Kicker opacity={0.45}>{label}</Kicker>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// StepIntro — Ch 1 · narrator above, diagram below
// ──────────────────────────────────────────────────────────
function StepIntro() {
  const { theme } = useTheme();
  return (
    <StepFrame chapter={1} chapterTitle="Position, time, spacetime" step={3} stepsTotal={6}>
      <div style={{
        height: '100%',
        display: 'grid', gridTemplateRows: 'auto 1fr auto',
        padding: '64px 80px 40px',
        rowGap: 24,
        maxWidth: 1100, margin: '0 auto', width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Narrator */}
        <div>
          <Kicker opacity={0.5} style={{ marginBottom: 18 }}>a worldline</Kicker>
          <div style={{
            fontFamily: lmSerif, fontSize: 30, lineHeight: 1.4,
            color: theme.ink, minHeight: 90, textWrap: 'pretty',
            maxWidth: 800,
          }}>
            <Typewriter
              text="Things in the world trace lines through this diagram. We call them worldlines — and every story we will tell here is a story about them."
              speed={28}
              pause={3400}
            />
          </div>
        </div>

        {/* Diagram */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <STDiagram width={680} height={460} variant="single" dotTrace vectorStroke={2.4} />
        </div>

        {/* Slim slider */}
        <div style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}>
          <Slider value={0.62} label="v / c" valueLabel="0.62" accent={theme.accent1} />
        </div>
      </div>
    </StepFrame>
  );
}

// ──────────────────────────────────────────────────────────
// StepSpeedBudget — Ch 2 · chat-feed narrator + twin vectors
// ──────────────────────────────────────────────────────────
function StepSpeedBudget() {
  const { theme } = useTheme();
  return (
    <StepFrame chapter={2} chapterTitle="The speed budget" step={4} stepsTotal={11}>
      <div style={{
        height: '100%', display: 'grid',
        gridTemplateColumns: '1fr 1.15fr', columnGap: 56,
        padding: '52px 64px 40px',
        boxSizing: 'border-box',
      }}>
        {/* LEFT — narrator chat feed */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 500 }}>
          <Kicker opacity={0.5} style={{ marginBottom: 22 }}>two travellers</Kicker>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 'auto' }}>
            {/* Past beat — faded */}
            <div style={{
              fontFamily: lmSerif, fontSize: 19, lineHeight: 1.5,
              color: theme.ink, opacity: 0.45, textWrap: 'pretty',
            }}>
              Both objects start at the same point in spacetime.
            </div>
            <div style={{
              fontFamily: lmSerif, fontSize: 19, lineHeight: 1.5,
              color: theme.ink, opacity: 0.45, textWrap: 'pretty',
            }}>
              <em style={{ color: theme.accent1, fontStyle: 'normal' }}>A</em> chooses to spend most of its
              speed budget on time. <em style={{ color: theme.accent2, fontStyle: 'normal' }}>B</em> spends
              more of hers on motion through space.
            </div>

            {/* Current beat — sharp */}
            <div style={{
              fontFamily: lmSerif, fontSize: 24, lineHeight: 1.45,
              color: theme.ink, paddingLeft: 18,
              borderLeft: `2px solid ${theme.inkMid}`,
              textWrap: 'pretty',
            }}>
              <Typewriter
                text="So whose clock runs slower? Drag either vector toward c and watch what the geometry gives you."
                speed={28}
                pause={3400}
              />
            </div>
          </div>

          {/* Reading mini-map */}
          <div style={{
            paddingTop: 22, marginTop: 24, borderTop: `1px solid ${theme.inkFaint}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, rowGap: 8,
          }}>
            <FactLine k="traveller A" v="v / c = 0.78" accent={theme.accent1} />
            <FactLine k="traveller B" v="v / c = 0.18" accent={theme.accent2} />
            <FactLine k="A's clock"   v="0.63 × proper" />
            <FactLine k="B's clock"   v="0.98 × proper" />
          </div>
        </div>

        {/* RIGHT — diagram + twin sliders */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            background: theme.paperAlt,
            padding: '22px 26px 18px',
            transition: 'background 0.4s',
            display: 'flex', flexDirection: 'column', flex: 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <Kicker opacity={0.55}>spacetime · normalized to c</Kicker>
              <div style={{ display: 'flex', gap: 14 }}>
                <Legend2 color={theme.accent1} label="A" />
                <Legend2 color={theme.accent2} label="B" />
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <STDiagram width={560} height={460} variant="pair" vectorStroke={2.6} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, marginTop: 22 }}>
            <Slider value={0.78} label="A · v / c" valueLabel="0.78" accent={theme.accent1} />
            <Slider value={0.18} label="B · v / c" valueLabel="0.18" accent={theme.accent2} />
          </div>
        </div>
      </div>
    </StepFrame>
  );
}

function FactLine({ k, v, accent }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{
        fontFamily: lmMono, fontSize: 10.5, letterSpacing: '0.14em',
        color: accent || theme.ink, opacity: accent ? 0.95 : 0.6,
        textTransform: 'uppercase',
      }}>{k}</span>
      <span style={{ fontFamily: lmMono, fontSize: 12, color: theme.ink, opacity: 0.85 }}>{v}</span>
    </div>
  );
}

function Legend2({ color, label }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 16, height: 2, background: color }} />
      <span style={{ fontFamily: lmMono, fontSize: 10.5, letterSpacing: '0.14em', color: theme.ink, textTransform: 'uppercase', opacity: 0.85 }}>{label}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// StepCone — Ch 3 · diagram fills the screen, narrator overlay
// ──────────────────────────────────────────────────────────
function StepCone() {
  const { theme } = useTheme();
  return (
    <StepFrame chapter={3} chapterTitle="Rolling the diagram" step={5} stepsTotal={8}>
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        {/* The cone, centered & big */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BigCone />
        </div>

        {/* Side label */}
        <div style={{
          position: 'absolute', top: 36, left: 40,
        }}>
          <Kicker opacity={0.5} style={{ marginBottom: 8 }}>flat → cylinder → cone</Kicker>
          <div style={{ fontFamily: lmSerif, fontStyle: 'italic', fontSize: 22, color: theme.ink, opacity: 0.85, maxWidth: 280 }}>
            the same diagram, rolled.
          </div>
        </div>

        {/* Side annotations */}
        <Annotation top={130} left={56} text="strong gravity" subtext="wide end" />
        <Annotation top={500} left={56} text="weak gravity" subtext="the point" lineDir="right" />

        {/* Narrator at the bottom, half-transparent panel */}
        <div style={{
          position: 'absolute', left: 40, right: 40, bottom: 32,
          padding: '22px 28px',
          background: theme.surface + 'ee',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1px solid ${theme.inkFaint}`,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 28, alignItems: 'center' }}>
            <div>
              <Kicker opacity={0.5} style={{ marginBottom: 8 }}>gravity, geometrically</Kicker>
              <div style={{
                fontFamily: lmSerif, fontSize: 22, lineHeight: 1.45,
                color: theme.ink, textWrap: 'pretty',
                maxWidth: 820,
              }}>
                <Typewriter
                  text="A straight worldline drawn on this cone curves spatially when we unroll it back. That is gravity — not a force, just geodesics on warped spacetime."
                  speed={26}
                  pause={3800}
                />
              </div>
            </div>
            <div style={{ minWidth: 280 }}>
              <Slider value={0.65} label="curvature" valueLabel="0.65" accent={theme.accent1} />
            </div>
          </div>
        </div>
      </div>
    </StepFrame>
  );
}

function BigCone() {
  const { theme } = useTheme();
  const { ink, accent1 } = theme;
  // larger, more detailed cone
  const cx = 360, top = 60, bottom = 460;
  const topR = 280, botR = 90;
  return (
    <svg width="720" height="520" viewBox="0 0 720 520">
      <g stroke={ink} strokeWidth="1" fill="none">
        {/* top + bottom rims */}
        <ellipse cx={cx} cy={top} rx={topR} ry="28" opacity="0.85" />
        <ellipse cx={cx} cy={bottom} rx={botR} ry="14" opacity="0.85" />
        {/* sides */}
        <line x1={cx - topR} y1={top} x2={cx - botR} y2={bottom} />
        <line x1={cx + topR} y1={top} x2={cx + botR} y2={bottom} />
        {/* meridians */}
        {[-0.85, -0.6, -0.3, 0, 0.3, 0.6, 0.85].map((k) => (
          <line
            key={'m' + k}
            x1={cx + topR * k}
            y1={top + Math.abs(k) * 6}
            x2={cx + botR * k}
            y2={bottom + Math.abs(k) * 3}
            opacity={0.35}
          />
        ))}
        {/* horizontal cross-section ellipses */}
        {[0.18, 0.42, 0.7].map((t) => {
          const y = top + t * (bottom - top);
          const r = topR + (botR - topR) * t;
          const ry = 28 + (14 - 28) * t;
          return <ellipse key={'e' + t} cx={cx} cy={y} rx={r} ry={ry} opacity="0.18" />;
        })}
      </g>

      {/* worldline curving on the cone surface (the worldline of a falling body) */}
      <path
        d={`M ${cx - topR * 0.55} ${top + 14} Q ${cx - 30} ${(top + bottom) / 2}, ${cx + botR * 0.55} ${bottom - 8}`}
        stroke={accent1}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${theme.glow1})` }}
      />
      {/* the dot tracing along — animated */}
      <circle r="5" fill={accent1}
        style={{
          animation: 'lmConeFall 5.5s cubic-bezier(.55,0,.45,1) infinite',
          filter: `drop-shadow(0 0 6px ${theme.glow1})`,
        }}
      >
        <animateMotion
          dur="5.5s"
          repeatCount="indefinite"
          path={`M ${cx - topR * 0.55} ${top + 14} Q ${cx - 30} ${(top + bottom) / 2}, ${cx + botR * 0.55} ${bottom - 8}`}
        />
      </circle>

      {/* tiny "house" at top rim & at the cone point */}
      <g stroke={ink} strokeWidth="1" fill="none" opacity="0.7">
        <polygon points={`${cx + topR * 0.5 - 6},${top - 4} ${cx + topR * 0.5},${top - 12} ${cx + topR * 0.5 + 6},${top - 4}`} />
        <rect x={cx + topR * 0.5 - 5} y={top - 4} width="10" height="8" />
      </g>
    </svg>
  );
}

function Annotation({ top, left, text, subtext, lineDir = 'right' }) {
  const { theme } = useTheme();
  return (
    <div style={{ position: 'absolute', top, left, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div>
        <div style={{ fontFamily: lmSerif, fontStyle: 'italic', fontSize: 17, color: theme.ink, opacity: 0.85 }}>{text}</div>
        {subtext && <Kicker opacity={0.45} style={{ marginTop: 4, fontSize: 9 }}>{subtext}</Kicker>}
      </div>
      {lineDir === 'right' && (
        <span style={{ width: 42, height: 1, background: theme.ink, opacity: 0.35 }} />
      )}
    </div>
  );
}

window.StepIntro = StepIntro;
window.StepSpeedBudget = StepSpeedBudget;
window.StepCone = StepCone;
