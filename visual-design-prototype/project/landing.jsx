// landing.jsx — lightmatters.app marketing landing page
// Hero with an animated spacetime diagram, manifesto, chapter previews,
// principles, and a closing CTA. Everything reads in either light or dark.

function Landing() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        width: '100%',
        background: theme.paper,
        color: theme.ink,
        fontFamily: lmSerif,
        transition: 'background 0.4s, color 0.4s',
        position: 'relative',
      }}
    >
      <LandingNav />
      <LandingHero />
      <LandingManifesto />
      <LandingChapters />
      <LandingPrinciples />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}

// ─────────── Nav ───────────
function LandingNav() {
  const { theme } = useTheme();
  return (
    <nav
      style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto auto',
        alignItems: 'center', columnGap: 32,
        padding: '26px 64px',
        borderBottom: `1px solid ${theme.inkFaint}`,
      }}
    >
      <Wordmark size={22} />
      <div />
      <div style={{ display: 'flex', gap: 32 }}>
        {['Chapters', 'About', 'Notes'].map((it) => (
          <a key={it} href="#" style={{
            fontFamily: lmSerif, fontSize: 16, color: theme.ink, opacity: 0.78,
            textDecoration: 'none', fontStyle: 'italic',
          }}>{it}</a>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}

// ─────────── Hero ───────────
function LandingHero() {
  const { theme } = useTheme();
  return (
    <section
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56,
        padding: '88px 64px 96px', alignItems: 'center',
        borderBottom: `1px solid ${theme.inkFaint}`,
      }}
    >
      <div>
        <Kicker style={{ marginBottom: 24 }}>an interactive journey</Kicker>
        <h2 style={{
          margin: 0,
          fontFamily: lmSerif, fontWeight: 500,
          fontSize: 84, lineHeight: 0.98, letterSpacing: '-0.018em',
          color: theme.ink, textWrap: 'balance',
        }}>
          Relativity, the way it<br />
          <em style={{ fontStyle: 'italic' }}>should have</em> clicked<br />
          the first time<span style={{ color: theme.accent1 }}>.</span>
        </h2>
        <p style={{
          marginTop: 28, fontFamily: lmSerif, fontSize: 20, lineHeight: 1.5,
          color: theme.ink, opacity: 0.78, maxWidth: 520, textWrap: 'pretty',
        }}>
          A guided journey of small interactive experiments — paper, vectors, light cones,
          gravity wells — that build intuition for spacetime before you ever see an equation.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 36 }}>
          <Button primary>begin chapter 1 →</Button>
          <Button>preview the journey</Button>
        </div>
        <div style={{
          marginTop: 28, display: 'flex', alignItems: 'center', gap: 16,
          fontFamily: lmMono, fontSize: 10.5, letterSpacing: '0.18em',
          color: theme.ink, opacity: 0.45, textTransform: 'uppercase',
        }}>
          <span>~ 90 min · 8 chapters · no prior physics</span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          padding: '32px 28px 18px',
          background: theme.paperAlt,
          transition: 'background 0.4s',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14,
          }}>
            <Kicker opacity={0.55}>chapter 2 · the speed budget</Kicker>
            <Kicker opacity={0.4}>step 03</Kicker>
          </div>
          <div style={{
            fontFamily: lmSerif, fontSize: 21, lineHeight: 1.45, color: theme.ink,
            marginBottom: 18, minHeight: 64, textWrap: 'pretty',
          }}>
            <Typewriter
              text="You are always moving through spacetime at the speed of light. You only choose how to spend it."
              speed={28}
              pause={3200}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <STDiagram width={500} height={380} variant="single" dotTrace />
          </div>
          <div style={{ marginTop: 8, paddingTop: 14, borderTop: `1px solid ${theme.inkFaint}` }}>
            <Slider value={0.62} label="v / c" valueLabel="0.62" accent={theme.accent1} />
          </div>
        </div>
        <div style={{
          position: 'absolute', top: -14, left: -14,
          width: 28, height: 28,
          background: theme.paper,
          fontFamily: lmMono, fontSize: 10, letterSpacing: '0.1em',
          color: theme.ink, opacity: 0.55,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${theme.inkFaint}`,
        }}>fig</div>
      </div>
    </section>
  );
}

// ─────────── Manifesto ───────────
function LandingManifesto() {
  const { theme } = useTheme();
  return (
    <section style={{
      padding: '88px 64px 96px',
      borderBottom: `1px solid ${theme.inkFaint}`,
      display: 'grid', gridTemplateColumns: '180px 1fr',
      columnGap: 56,
    }}>
      <Kicker opacity={0.55} style={{ paddingTop: 8 }}>I · why</Kicker>
      <div>
        <p style={{
          margin: 0, fontFamily: lmSerif, fontSize: 30, lineHeight: 1.4,
          color: theme.ink, maxWidth: 880, textWrap: 'pretty',
          fontWeight: 500,
        }}>
          Most people meet relativity as equations or analogies that
          never quite click. <em>Light Matters</em> is the other way in —
          a sequence of small drawings you can hold in one hand, then
          tilt, dial, and break open until the geometry tells you
          what the math meant all along.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 36, rowGap: 12, marginTop: 56 }}>
          {[
            ['intuition first', 'every idea starts as a picture you can grab.'],
            ['a journey, paced', 'narrated, beat by beat. Skip ahead any time.'],
            ['no prior math', 'equations only after the picture has clicked.'],
          ].map(([head, body]) => (
            <div key={head} style={{ borderTop: `1px solid ${theme.inkFaint}`, paddingTop: 18 }}>
              <div style={{ fontFamily: lmSerif, fontStyle: 'italic', fontSize: 22, color: theme.ink, marginBottom: 10 }}>{head}</div>
              <div style={{ fontFamily: lmSerif, fontSize: 16, lineHeight: 1.5, color: theme.ink, opacity: 0.7, textWrap: 'pretty' }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── Chapters preview ───────────
function LandingChapters() {
  const { theme } = useTheme();
  const chapters = [
    { n: 1, title: 'Position, time, spacetime', blurb: 'A point on an axis. Time on another. The diagram everything else lives on.', mini: 'axes' },
    { n: 2, title: 'The speed budget',          blurb: 'You move through spacetime at c — always. Choose how to spend it.',          mini: 'pair'  },
    { n: 3, title: 'Rolling the diagram',       blurb: 'Bend the paper into a cone. Gravity is the geometry, not a force.',           mini: 'cone'  },
    { n: 4, title: "The center of the Earth",   blurb: 'A gravity well that bottoms out in weightlessness. Drop a particle and watch.', mini: 'well'  },
    { n: 5, title: 'Light and information',     blurb: 'Wavefronts and observers. Why simultaneity is in the eye of the beholder.',    mini: 'wavefront' },
    { n: 6, title: 'The ether was wrong',       blurb: 'Light does not inherit the motion of its source. Why c is the same for everyone.', mini: 'doppler' },
    { n: 7, title: 'Doppler and seeing motion', blurb: 'Compress the wavefronts and watch the clock change colour.',                  mini: 'doppler' },
    { n: 8, title: 'Light bending around mass', blurb: 'Two edges of a beam. Two paths. One synchronised arrival.',                   mini: 'bend' },
  ];
  return (
    <section style={{
      padding: '88px 64px 96px',
      borderBottom: `1px solid ${theme.inkFaint}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 44 }}>
        <Kicker opacity={0.55}>II · the journey</Kicker>
        <h3 style={{ margin: 0, fontFamily: lmSerif, fontStyle: 'italic', fontWeight: 500, fontSize: 30, color: theme.ink }}>
          eight chapters, paced for an evening.
        </h3>
        <span style={{ flex: 1, height: 1, background: theme.inkFaint, marginBottom: 8 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 24, rowGap: 32 }}>
        {chapters.map((c) => (
          <ChapterCard key={c.n} {...c} />
        ))}
      </div>
    </section>
  );
}

function ChapterCard({ n, title, blurb, mini }) {
  const { theme } = useTheme();
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: theme.paperAlt,
        padding: 22,
        cursor: 'pointer',
        transition: 'background 0.4s, box-shadow 0.2s, transform 0.2s',
        boxShadow: hover ? `0 0 0 1px ${theme.ink}, 0 0 0 5px ${theme.glow1}` : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <Kicker opacity={0.55}>ch. {String(n).padStart(2, '0')}</Kicker>
        <span style={{ fontFamily: lmMono, fontSize: 11, color: theme.ink, opacity: 0.35 }}>→</span>
      </div>
      <div style={{ height: 100, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <STDiagram variant={`mini-${mini}`} width={180} height={100} />
      </div>
      <div style={{ fontFamily: lmSerif, fontSize: 18, color: theme.ink, marginBottom: 8, lineHeight: 1.25, fontWeight: 500 }}>{title}</div>
      <div style={{ fontFamily: lmSerif, fontSize: 14, lineHeight: 1.5, color: theme.ink, opacity: 0.65, textWrap: 'pretty' }}>{blurb}</div>
    </div>
  );
}

// ─────────── Principles ───────────
function LandingPrinciples() {
  const { theme } = useTheme();
  const lines = [
    ['One screen.', 'One idea. One beat of narration. One thing to try.'],
    ['Show, then play.', 'The animation runs. Then the controls become yours.'],
    ['Paper before pixels.', 'Line work, serif type, generous margins. Made to read for an hour.'],
    ['The reader sets the pace.', 'Every reveal is skippable. Every animation can be replayed.'],
  ];
  return (
    <section style={{
      padding: '88px 64px 96px',
      borderBottom: `1px solid ${theme.inkFaint}`,
      display: 'grid', gridTemplateColumns: '180px 1fr',
      columnGap: 56,
    }}>
      <Kicker opacity={0.55} style={{ paddingTop: 8 }}>III · how</Kicker>
      <div style={{ display: 'grid', rowGap: 22 }}>
        {lines.map(([h, b], i) => (
          <div key={h} style={{
            display: 'grid', gridTemplateColumns: '64px 320px 1fr', columnGap: 36,
            alignItems: 'baseline',
            paddingBottom: 22,
            borderBottom: i < lines.length - 1 ? `1px solid ${theme.inkFaint}` : 'none',
          }}>
            <Kicker opacity={0.45}>{String(i + 1).padStart(2, '0')}</Kicker>
            <div style={{ fontFamily: lmSerif, fontStyle: 'italic', fontSize: 32, color: theme.ink, lineHeight: 1.1 }}>{h}</div>
            <div style={{ fontFamily: lmSerif, fontSize: 18, lineHeight: 1.55, color: theme.ink, opacity: 0.75, textWrap: 'pretty', maxWidth: 540 }}>{b}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────── Closing CTA ───────────
function LandingCTA() {
  const { theme } = useTheme();
  return (
    <section style={{
      padding: '120px 64px',
      display: 'grid', placeItems: 'center',
      textAlign: 'center',
      borderBottom: `1px solid ${theme.inkFaint}`,
    }}>
      <Kicker opacity={0.5} style={{ marginBottom: 18 }}>begin</Kicker>
      <h2 style={{
        margin: 0,
        fontFamily: lmSerif, fontWeight: 500,
        fontSize: 76, lineHeight: 1.02, letterSpacing: '-0.015em',
        color: theme.ink, maxWidth: 880, textWrap: 'balance',
      }}>
        Light is not metaphor. <em>It is the geometry.</em>
      </h2>
      <p style={{
        marginTop: 24, fontFamily: lmSerif, fontSize: 20, lineHeight: 1.45,
        color: theme.ink, opacity: 0.75, maxWidth: 620, textWrap: 'pretty',
      }}>
        Spend ninety minutes inside the diagram and the universe stops being a lecture.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40 }}>
        <Button primary>begin chapter 1 →</Button>
        <Button>read the founder's note</Button>
      </div>
    </section>
  );
}

// ─────────── Footer ───────────
function LandingFooter() {
  const { theme } = useTheme();
  return (
    <footer style={{
      padding: '36px 64px',
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
      columnGap: 32, alignItems: 'baseline',
    }}>
      <Wordmark size={18} />
      <div style={{ textAlign: 'center', fontFamily: lmMono, fontSize: 10, letterSpacing: '0.22em', color: theme.ink, opacity: 0.5, textTransform: 'uppercase' }}>
        a paper companion to Epstein's <em style={{ fontFamily: lmSerif, fontStyle: 'italic', letterSpacing: 'normal', textTransform: 'none', fontSize: 13 }}>Relativity Visualized</em>
      </div>
      <div style={{ textAlign: 'right', fontFamily: lmMono, fontSize: 10, letterSpacing: '0.22em', color: theme.ink, opacity: 0.5, textTransform: 'uppercase' }}>
        © {new Date().getFullYear()} · lightmatters.app
      </div>
    </footer>
  );
}

window.Landing = Landing;
