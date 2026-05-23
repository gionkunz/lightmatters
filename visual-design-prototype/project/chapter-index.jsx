// chapter-index.jsx — journey map / table of contents
// 8 chapters arranged as a boustrophedon worldline. The reader's progress
// is drawn as the solid portion of the line; remaining chapters dotted.

const lmChapters = [
  { n: 1, title: 'Position, time, spacetime',   blurb: 'A point on an axis. Time on another. Establish the diagram everything else lives on.',                          mini: 'axes',     steps: 6, status: 'done' },
  { n: 2, title: 'The speed budget',            blurb: 'You move through spacetime at c — always. Choose how to allocate it between space and time.',                  mini: 'pair',     steps: 11, status: 'current', currentStep: 4 },
  { n: 3, title: 'Rolling the diagram',         blurb: 'Bend the paper into a cone. Gravity falls out as the geometry, not a force.',                                  mini: 'cone',     steps: 8, status: 'upcoming' },
  { n: 4, title: 'The center of the Earth',     blurb: 'A gravity well that bottoms out in weightlessness. Drop a particle and watch it spiral.',                       mini: 'well',     steps: 7, status: 'upcoming' },
  { n: 5, title: 'Light and information',       blurb: 'Wavefronts, observers, the relativity of simultaneity. Aberration as rain on a windshield.',                    mini: 'wavefront',steps: 9, status: 'upcoming' },
  { n: 6, title: 'The ether was wrong',         blurb: 'Light does not inherit the motion of its source. Why c is the same for every observer.',                       mini: 'doppler',  steps: 6, status: 'upcoming' },
  { n: 7, title: 'Doppler and seeing motion',   blurb: 'Compress the wavefronts. The clock changes colour. Redshift, blueshift, and time dilation in one picture.',     mini: 'doppler',  steps: 8, status: 'upcoming' },
  { n: 8, title: 'Light bending around mass',   blurb: 'Two edges of a beam. Two paths. One synchronised arrival — straight lines on a curved canvas.',                 mini: 'bend',     steps: 7, status: 'upcoming' },
];

function ChapterIndex() {
  const { theme } = useTheme();
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: theme.paper, color: theme.ink,
        fontFamily: lmSerif, position: 'relative',
        padding: '40px 56px',
        display: 'grid', gridTemplateRows: 'auto 1fr auto', rowGap: 28,
        transition: 'background 0.4s, color 0.4s',
      }}
    >
      <ThemeToggle style={{ position: 'absolute', top: 36, right: 36 }} />

      <CIHeader />
      <JourneyMap />
      <CIFooter />
    </div>
  );
}

// ─────────── Header strip ───────────
function CIHeader() {
  const { theme } = useTheme();
  return (
    <header style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'end', columnGap: 32, paddingBottom: 12, borderBottom: `1px solid ${theme.inkFaint}` }}>
      <div>
        <Kicker opacity={0.55} style={{ marginBottom: 8 }}>00 — the journey</Kicker>
        <Wordmark size={32} />
      </div>
      <div />
      <ProgressStat label="you are here" value="ch. 02 · step 04" emphasised />
      <ProgressStat label="time on page" value="27 min" />
      <ProgressStat label="beats remaining" value="58 of 62" />
    </header>
  );
}

function ProgressStat({ label, value, emphasised }) {
  const { theme } = useTheme();
  return (
    <div style={{
      paddingLeft: 22,
      borderLeft: `1px solid ${theme.inkFaint}`,
      minWidth: 130,
    }}>
      <Kicker opacity={0.55} style={{ marginBottom: 6, fontSize: 9.5 }}>{label}</Kicker>
      <div style={{
        fontFamily: lmSerif, fontStyle: emphasised ? 'italic' : 'normal',
        fontWeight: emphasised ? 500 : 400,
        fontSize: emphasised ? 22 : 18,
        color: theme.ink, lineHeight: 1,
      }}>{value}</div>
    </div>
  );
}

// ─────────── Journey map ───────────
function JourneyMap() {
  const { theme } = useTheme();
  // Layout — 8 cards in boustrophedon
  const cardW = 350, cardH = 320;
  const colGap = 28, rowGap = 110;
  const positions = [
    [0, 0], [1, 0], [2, 0], [3, 0],
    [3, 1], [2, 1], [1, 1], [0, 1],
  ];
  const totalW = 4 * cardW + 3 * colGap;
  const totalH = 2 * cardH + rowGap;

  // Centers of each card (used to draw the worldline)
  const centers = positions.map(([c, r]) => ({
    x: c * (cardW + colGap) + cardW / 2,
    y: r * (cardH + rowGap) + cardH / 2,
  }));

  // Current chapter index (2 → array index 1)
  const currentIdx = lmChapters.findIndex((c) => c.status === 'current');
  // Length of the line up to the current position (we'll mark progress).
  // We model the path as straight segments + curved turn at the right edge.

  return (
    <div style={{
      position: 'relative',
      width: totalW, height: totalH,
      margin: '0 auto',
    }}>
      {/* Worldline SVG, sits behind the cards */}
      <WorldlineSVG
        centers={centers}
        cardW={cardW} cardH={cardH}
        currentIdx={currentIdx}
        width={totalW} height={totalH}
      />

      {/* Chapter cards */}
      {lmChapters.map((ch, i) => {
        const [col, row] = positions[i];
        return (
          <ChapterNode
            key={ch.n}
            ch={ch}
            style={{
              position: 'absolute',
              left: col * (cardW + colGap),
              top: row * (cardH + rowGap),
              width: cardW, height: cardH,
            }}
          />
        );
      })}
    </div>
  );
}

function WorldlineSVG({ centers, cardW, cardH, currentIdx, width, height }) {
  const { theme } = useTheme();
  // Build path: from card edge to card edge, with smooth U-turn at the right end.
  // Cards are absolutely placed; we draw the path between their edges.
  const inset = 24; // distance inside card edges
  // For each pair, draw line between right-edge of one and left-edge of the next,
  // unless they're vertically stacked (between idx 3 and 4) — then curve.
  const segments = [];
  for (let i = 0; i < centers.length - 1; i++) {
    const a = centers[i], b = centers[i + 1];
    if (a.y === b.y && b.x > a.x) {
      // Row 1, left to right
      segments.push({ kind: 'h', from: { x: a.x + cardW / 2 - inset, y: a.y }, to: { x: b.x - cardW / 2 + inset, y: b.y } });
    } else if (a.y === b.y && b.x < a.x) {
      // Row 2, right to left
      segments.push({ kind: 'h', from: { x: a.x - cardW / 2 + inset, y: a.y }, to: { x: b.x + cardW / 2 - inset, y: b.y } });
    } else {
      // Curve down at the right edge (after idx 3)
      const fromX = a.x + cardW / 2 - inset;
      const fromY = a.y;
      const toX = b.x + cardW / 2 - inset;
      const toY = b.y;
      segments.push({ kind: 'curve', from: { x: fromX, y: fromY }, to: { x: toX, y: toY }, control1: { x: fromX + 80, y: fromY }, control2: { x: toX + 80, y: toY } });
    }
  }

  // Convert to SVG path string
  const pathFor = (seg) => {
    if (seg.kind === 'h') return `M ${seg.from.x} ${seg.from.y} L ${seg.to.x} ${seg.to.y}`;
    return `M ${seg.from.x} ${seg.from.y} C ${seg.control1.x} ${seg.control1.y}, ${seg.control2.x} ${seg.control2.y}, ${seg.to.x} ${seg.to.y}`;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {/* Faint full path (the path of upcoming) */}
      {segments.map((seg, i) => (
        <path
          key={'u' + i}
          d={pathFor(seg)}
          fill="none"
          stroke={theme.ink}
          strokeWidth="1"
          opacity="0.18"
          strokeDasharray="3 5"
        />
      ))}
      {/* Solid path for completed segments (up to currentIdx, partial through current) */}
      {segments.slice(0, currentIdx).map((seg, i) => (
        <path
          key={'d' + i}
          d={pathFor(seg)}
          fill="none"
          stroke={theme.ink}
          strokeWidth="1.4"
          opacity="0.85"
        />
      ))}
      {/* Light cone reference at start */}
      <line
        x1={centers[0].x} y1={centers[0].y}
        x2={centers[0].x + 50} y2={centers[0].y - 50}
        stroke={theme.ink} strokeWidth="1" strokeDasharray="2 4" opacity="0.3"
      />
      <text
        x={centers[0].x + 56} y={centers[0].y - 56}
        fontFamily={lmMono} fontSize="10" letterSpacing="0.1em"
        fill={theme.ink} opacity="0.4"
      >c</text>
    </svg>
  );
}

// ─────────── Chapter node card ───────────
function ChapterNode({ ch, style }) {
  const { theme } = useTheme();
  const [hover, setHover] = React.useState(false);
  const isCurrent = ch.status === 'current';
  const isDone = ch.status === 'done';

  const cardBg = isCurrent ? theme.paperAlt : theme.paperAlt;
  const inkOpacity = ch.status === 'upcoming' ? 0.55 : 1;
  const accent = isCurrent ? theme.accent1 : theme.ink;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...style,
        background: cardBg,
        border: `1px solid ${isCurrent ? theme.accent1 : theme.inkFaint}`,
        cursor: 'pointer',
        padding: '20px 22px',
        display: 'flex', flexDirection: 'column',
        boxShadow: isCurrent
          ? `0 0 0 4px ${theme.glow1}`
          : (hover ? `0 0 0 3px ${theme.glow1}` : 'none'),
        transition: 'box-shadow 0.2s, transform 0.2s, background 0.4s, border-color 0.4s',
        transform: hover && !isCurrent ? 'translateY(-2px)' : 'none',
        opacity: ch.status === 'upcoming' ? 1 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          fontFamily: lmSerif, fontStyle: 'italic', fontSize: 28,
          color: theme.ink, opacity: inkOpacity,
          fontWeight: 500, letterSpacing: '-0.01em',
        }}>
          {String(ch.n).padStart(2, '0')}
        </div>
        <StatusPill status={ch.status} currentStep={ch.currentStep} steps={ch.steps} />
      </div>

      <div style={{ height: 110, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ch.status === 'upcoming' ? 0.5 : 1 }}>
        <STDiagram variant={`mini-${ch.mini}`} width={200} height={110} />
      </div>

      <div style={{
        fontFamily: lmSerif, fontSize: 19,
        color: theme.ink, opacity: inkOpacity,
        marginBottom: 8, lineHeight: 1.2, fontWeight: 500,
      }}>{ch.title}</div>
      <div style={{
        fontFamily: lmSerif, fontSize: 14, lineHeight: 1.5,
        color: theme.ink, opacity: ch.status === 'upcoming' ? 0.5 : 0.7,
        textWrap: 'pretty',
      }}>{ch.blurb}</div>

      {/* Step dots */}
      <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', gap: 4, alignItems: 'center' }}>
        {Array.from({ length: ch.steps }).map((_, k) => {
          const filled = isDone || (isCurrent && k < ch.currentStep);
          const here = isCurrent && k === ch.currentStep - 1;
          return (
            <span key={k} style={{
              width: here ? 14 : 6, height: 6, borderRadius: 6,
              background: here ? theme.accent1 : (filled ? theme.ink : 'transparent'),
              border: `1px solid ${filled || here ? 'transparent' : theme.inkFaint}`,
              boxShadow: here ? `0 0 8px ${theme.glow1}` : 'none',
              transition: 'background 0.4s',
            }} />
          );
        })}
        <span style={{ flex: 1 }} />
        <Kicker opacity={0.4} style={{ fontSize: 9 }}>{ch.steps} beats</Kicker>
      </div>
    </div>
  );
}

function StatusPill({ status, currentStep, steps }) {
  const { theme } = useTheme();
  const label = status === 'done' ? 'read' : status === 'current' ? `step ${currentStep} / ${steps}` : 'upcoming';
  const bg = status === 'current' ? theme.accent1 : 'transparent';
  const fg = status === 'current' ? theme.paper : theme.ink;
  return (
    <div style={{
      background: bg,
      border: status === 'current' ? 'none' : `1px solid ${theme.inkFaint}`,
      padding: '4px 10px',
      fontFamily: lmMono, fontSize: 9.5, letterSpacing: '0.18em',
      color: fg, opacity: status === 'upcoming' ? 0.55 : 1,
      textTransform: 'uppercase', fontWeight: 500,
      boxShadow: status === 'current' ? `0 0 12px ${theme.glow1}` : 'none',
    }}>{label}</div>
  );
}

// ─────────── Footer ───────────
function CIFooter() {
  const { theme } = useTheme();
  return (
    <footer style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 18, borderTop: `1px solid ${theme.inkFaint}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Legend swatch={theme.ink} solid label="read" />
        <Legend swatch={theme.accent1} label="you are here" glow />
        <Legend swatch={theme.ink} dotted label="upcoming" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Button>restart journey</Button>
        <Button primary>resume — ch. 02 / step 04 →</Button>
      </div>
    </footer>
  );
}

function Legend({ swatch, label, solid, dotted, glow }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        width: 24, height: 1,
        background: solid || glow ? swatch : 'transparent',
        borderTop: dotted ? `1px dashed ${swatch}` : 'none',
        boxShadow: glow ? `0 0 8px ${theme.glow1}` : 'none',
      }} />
      <Kicker opacity={0.7}>{label}</Kicker>
    </div>
  );
}

window.ChapterIndex = ChapterIndex;
