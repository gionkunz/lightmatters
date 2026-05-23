// primitives.jsx — shared rendering primitives, all read from useTheme().
// Glow is reserved for INTERACTIVE elements only (buttons, slider thumbs,
// focused inputs). Diagrams render as line art with no halo.

const { useState: lmUseState, useEffect: lmUseEffect, useRef: lmUseRef } = React;
const mono = "'IBM Plex Mono', ui-monospace, monospace";
const serif = "'EB Garamond', 'Iowan Old Style', serif";

// ─────────── Typewriter — looping reveal ───────────
function Typewriter({ text, speed = 30, pause = 2600, style, caretColor }) {
  const [i, setI] = lmUseState(0);
  lmUseEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => setI(i + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI(0), pause);
    return () => clearTimeout(t);
  }, [i, text, speed, pause]);
  return (
    <span style={style}>
      {text.slice(0, i)}
      <span
        style={{
          display: 'inline-block',
          width: '0.42em',
          marginLeft: 1,
          color: caretColor || 'currentColor',
          opacity: i >= text.length ? 0 : 0.6,
          animation: 'lmBlink 1.1s steps(2) infinite',
        }}
      >▍</span>
    </span>
  );
}

// ─────────── Section rule ───────────
function SectionRule({ num, title }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.22em', color: theme.ink, opacity: 0.5, textTransform: 'uppercase', fontWeight: 500 }}>{num}</span>
      <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 19, color: theme.ink }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: theme.ink, opacity: 0.13 }} />
    </div>
  );
}

// ─────────── Page stamp ───────────
function Stamp({ index, total, name, align = 'left' }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.28em', color: theme.ink, opacity: 0.55, textTransform: 'uppercase', fontWeight: 500 }}>
        {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: theme.ink, opacity: 0.85 }}>{name}</div>
    </div>
  );
}

// ─────────── Wordmark ───────────
function Wordmark({ size = 64, color, withDot = true, lineHeight = 0.95 }) {
  const { theme } = useTheme();
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: serif,
        fontWeight: 500,
        fontStyle: 'normal',
        fontSize: size,
        letterSpacing: '-0.015em',
        lineHeight,
        color: color || theme.ink,
        transition: 'color 0.4s',
      }}
    >
      Light Matters{withDot && <span style={{ color: theme.accent1 }}>.</span>}
    </h1>
  );
}

// ─────────── Color swatch ───────────
function Swatch({ color, name, code, ring }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 56, height: 56, background: color,
          boxShadow: ring ? `inset 0 0 0 1px ${ring}` : `inset 0 0 0 1px ${theme.inkVeryFaint}`,
          flex: '0 0 auto',
          transition: 'background 0.4s',
        }}
      />
      <div>
        <div style={{ fontFamily: serif, fontSize: 17, color: theme.ink, fontStyle: 'italic', lineHeight: 1 }}>{name}</div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: theme.ink, opacity: 0.55, marginTop: 5, letterSpacing: '0.06em' }}>{code}</div>
      </div>
    </div>
  );
}

// ─────────── Type specimen ───────────
function TypeSpecimen({ displaySample = 'Aa', bodySample, labelSample, displayItalic = false }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', columnGap: 24, rowGap: 18, alignItems: 'baseline' }}>
      <div style={{ fontFamily: serif, fontSize: 96, lineHeight: 0.85, color: theme.ink, fontStyle: displayItalic ? 'italic' : 'normal', fontWeight: 500 }}>{displaySample}</div>
      <div>
        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, color: theme.ink, marginBottom: 6 }}>EB Garamond · display</div>
        <div style={{ fontFamily: serif, fontSize: 28, lineHeight: 1.25, color: theme.ink, fontWeight: 500 }}>An interactive journey into light, matter, spacetime, and relativity.</div>
      </div>

      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, color: theme.ink, alignSelf: 'start', paddingTop: 6 }}>body</div>
      <div style={{ fontFamily: serif, fontSize: 17.5, lineHeight: 1.55, color: theme.ink, textWrap: 'pretty' }}>{bodySample}</div>

      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, color: theme.ink, alignSelf: 'start', paddingTop: 4 }}>labels</div>
      <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.08em', color: theme.ink, opacity: 0.85 }}>{labelSample}</div>
    </div>
  );
}

// ─────────── Spacetime diagram primitive ───────────
// variant: 'single' | 'pair' | 'wavefront' | 'cone' | 'mini-vector' | 'mini-pair' | 'mini-wavefront' | 'mini-cone' | 'mini-axes'
function STDiagram({
  width = 460, height = 420,
  variant = 'single',
  vectorStroke = 2.2,
  axisOpacity = 1,
  showLabels = true,
  showLight = true,
  dotTrace = false,
}) {
  const { theme } = useTheme();
  const { ink, accent1, accent2 } = theme;
  const left = 70, bottom = 360, top = 40, right = 420;
  const len = 240;

  // Mini variants — smaller, simpler, for thumbnails (chapter index)
  if (variant.startsWith('mini')) {
    return <STMini variant={variant.replace('mini-', '')} width={width} height={height} />;
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* Axes */}
      <g stroke={ink} strokeWidth="1" fill="none" opacity={axisOpacity}>
        <line x1={left} y1={bottom} x2={right} y2={bottom} />
        <line x1={left} y1={bottom} x2={left} y2={top} />
        {[1, 2, 3, 4, 5].map((k) => (
          <g key={'tx' + k}>
            <line x1={left + k * ((right - left) / 6)} y1={bottom} x2={left + k * ((right - left) / 6)} y2={bottom + 5} />
          </g>
        ))}
        {[1, 2, 3, 4, 5].map((k) => (
          <g key={'ty' + k}>
            <line x1={left - 5} y1={bottom - k * ((bottom - top) / 6)} x2={left} y2={bottom - k * ((bottom - top) / 6)} />
          </g>
        ))}
      </g>

      {showLight && (
        <line
          x1={left} y1={bottom}
          x2={left + (bottom - top)} y2={top}
          stroke={ink} strokeWidth="1" strokeDasharray="3 4" opacity={axisOpacity * 0.55}
          fill="none"
        />
      )}

      {/* Vector(s) */}
      {variant === 'single' && (
        <g style={{ transformOrigin: `${left}px ${bottom}px`, animation: 'lmVectorSwing 6.4s cubic-bezier(.6,.05,.4,.95) infinite' }}>
          <line x1={left} y1={bottom} x2={left} y2={bottom - len} stroke={ink} strokeWidth={vectorStroke} strokeLinecap="round" />
          <polyline
            points={`${left - 6},${bottom - len + 9} ${left},${bottom - len} ${left + 6},${bottom - len + 9}`}
            stroke={ink} strokeWidth={vectorStroke} fill="none" strokeLinejoin="round" strokeLinecap="round"
          />
          {dotTrace && <circle cx={left} cy={bottom - len} r="3.5" fill={ink} />}
        </g>
      )}

      {variant === 'pair' && (
        <>
          <g style={{ transformOrigin: `${left}px ${bottom}px`, animation: 'lmVectorA 6.4s cubic-bezier(.6,.05,.4,.95) infinite' }}>
            <line x1={left} y1={bottom} x2={left} y2={bottom - len} stroke={accent1} strokeWidth={vectorStroke + 0.2} strokeLinecap="round" />
            <polyline
              points={`${left - 6},${bottom - len + 9} ${left},${bottom - len} ${left + 6},${bottom - len + 9}`}
              stroke={accent1} strokeWidth={vectorStroke + 0.2} fill="none" strokeLinejoin="round" strokeLinecap="round"
            />
          </g>
          <g style={{ transformOrigin: `${left}px ${bottom}px`, animation: 'lmVectorB 6.4s cubic-bezier(.6,.05,.4,.95) infinite' }}>
            <line x1={left} y1={bottom} x2={left} y2={bottom - len} stroke={accent2} strokeWidth={vectorStroke + 0.2} strokeLinecap="round" />
            <polyline
              points={`${left - 6},${bottom - len + 9} ${left},${bottom - len} ${left + 6},${bottom - len + 9}`}
              stroke={accent2} strokeWidth={vectorStroke + 0.2} fill="none" strokeLinejoin="round" strokeLinecap="round"
            />
          </g>
        </>
      )}

      {variant === 'wavefront' && (
        <>
          <g style={{ transformOrigin: `${left}px ${bottom - len * 0.55}px`, animation: 'lmEmit 1.4s ease-in-out infinite' }}>
            <circle cx={left + 30} cy={bottom - len * 0.55} r="4" fill={accent1} />
          </g>
          {[0, 1, 2, 3].map((k) => (
            <circle
              key={'w' + k}
              cx={left + 30}
              cy={bottom - len * 0.55}
              r="0"
              fill="none"
              stroke={accent1}
              strokeWidth="1.4"
              style={{ animation: `lmWave 4.2s ease-out ${k * 1.05}s infinite` }}
            />
          ))}
          {/* observer marker (stick figure) */}
          <g stroke={accent2} strokeWidth="1.6" fill="none">
            <circle cx={right - 40} cy={bottom - len * 0.55 - 8} r="5" />
            <line x1={right - 40} y1={bottom - len * 0.55 - 3} x2={right - 40} y2={bottom - len * 0.55 + 12} />
            <line x1={right - 46} y1={bottom - len * 0.55 + 16} x2={right - 34} y2={bottom - len * 0.55 + 16} />
          </g>
        </>
      )}

      {variant === 'cone' && <ConeShape ink={ink} accent={accent1} />}

      {showLabels && (
        <g fill={ink} fontFamily={mono} fontSize="11" letterSpacing="0.1em" style={{ textTransform: 'uppercase' }}>
          <text x={right + 8} y={bottom + 4} opacity="0.65">x</text>
          <text x={left - 4} y={top - 8} opacity="0.65">t</text>
        </g>
      )}
      {showLight && variant !== 'wavefront' && variant !== 'cone' && (
        <g fill={ink} fontFamily={serif} fontStyle="italic" fontSize="14">
          <text x={left + (bottom - top) + 8} y={top + 4} opacity="0.55">c</text>
        </g>
      )}
    </svg>
  );
}

// Mini diagrams for chapter thumbnails — fits in ~180×120 cards
function STMini({ variant, width = 180, height = 120 }) {
  const { theme } = useTheme();
  const { ink, accent1, accent2 } = theme;
  const left = 16, bottom = height - 16, top = 16, right = width - 16;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <g stroke={ink} strokeWidth="1" fill="none" opacity="0.85">
        <line x1={left} y1={bottom} x2={right} y2={bottom} />
        <line x1={left} y1={bottom} x2={left} y2={top} />
      </g>
      {variant === 'axes' && (
        <g fill={ink} fontFamily={mono} fontSize="9" opacity="0.7">
          <text x={right - 6} y={bottom - 4}>x</text>
          <text x={left + 4} y={top + 9}>t</text>
        </g>
      )}
      {variant === 'vector' && (
        <line x1={left} y1={bottom} x2={left + 28} y2={top + 4} stroke={ink} strokeWidth="2" strokeLinecap="round" />
      )}
      {variant === 'pair' && (
        <>
          <line x1={left} y1={bottom} x2={left + 38} y2={top + 18} stroke={accent1} strokeWidth="2" strokeLinecap="round" />
          <line x1={left} y1={bottom} x2={left + 16} y2={top + 6} stroke={accent2} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {variant === 'cone' && (
        <g stroke={ink} strokeWidth="1" fill="none">
          <ellipse cx={width / 2} cy={top + 16} rx={width / 2 - left} ry="6" />
          <ellipse cx={width / 2} cy={bottom} rx={(width / 2 - left) * 0.45} ry="4" />
          <line x1={left} y1={top + 16} x2={width / 2 - (width / 2 - left) * 0.45} y2={bottom} />
          <line x1={right} y1={top + 16} x2={width / 2 + (width / 2 - left) * 0.45} y2={bottom} />
        </g>
      )}
      {variant === 'wavefront' && (
        <g stroke={accent1} strokeWidth="1.2" fill="none">
          <circle cx={width / 2 - 30} cy={height / 2} r="6" />
          <circle cx={width / 2 - 30} cy={height / 2} r="18" opacity="0.7" />
          <circle cx={width / 2 - 30} cy={height / 2} r="32" opacity="0.4" />
          <circle cx={width / 2 - 30} cy={height / 2} r="4" fill={accent1} stroke="none" />
        </g>
      )}
      {variant === 'well' && (
        <g stroke={ink} strokeWidth="1" fill="none">
          <path d={`M ${left} ${top + 14} Q ${width / 2} ${bottom + 36}, ${right} ${top + 14}`} />
          <path d={`M ${left} ${top + 26} Q ${width / 2} ${bottom + 18}, ${right} ${top + 26}`} opacity="0.6" />
          <path d={`M ${left} ${top + 38} Q ${width / 2} ${bottom + 4}, ${right} ${top + 38}`} opacity="0.35" />
        </g>
      )}
      {variant === 'doppler' && (
        <g stroke={ink} strokeWidth="1" fill="none">
          <circle cx={width * 0.35} cy={height / 2} r="10" />
          <circle cx={width * 0.35} cy={height / 2} r="22" opacity="0.7" />
          <circle cx={width * 0.65} cy={height / 2} r="6" opacity="0.5" />
          <circle cx={width * 0.65} cy={height / 2} r="14" opacity="0.3" />
          <line x1={width * 0.35} y1={height / 2} x2={width * 0.65} y2={height / 2} stroke={ink} strokeDasharray="2 3" />
        </g>
      )}
      {variant === 'bend' && (
        <g stroke={ink} strokeWidth="1" fill="none">
          <circle cx={width / 2} cy={height / 2 + 4} r="14" />
          <path d={`M ${left} ${height / 2 - 14} Q ${width / 2} ${height / 2 - 26}, ${right} ${height / 2 - 6}`} stroke={accent1} strokeWidth="1.4" />
          <path d={`M ${left} ${height / 2 + 22} Q ${width / 2} ${height / 2 + 34}, ${right} ${height / 2 + 14}`} stroke={accent1} strokeWidth="1.4" />
        </g>
      )}
    </svg>
  );
}

// 3D-feel wireframe cone (for ch.3 step)
function ConeShape({ ink, accent }) {
  const cx = 245, top = 60, bottom = 340;
  const topR = 130, botR = 50;
  return (
    <g stroke={ink} strokeWidth="1.1" fill="none">
      {/* top + bottom rims */}
      <ellipse cx={cx} cy={top} rx={topR} ry="14" />
      <ellipse cx={cx} cy={bottom} rx={botR} ry="8" />
      {/* sides */}
      <line x1={cx - topR} y1={top} x2={cx - botR} y2={bottom} />
      <line x1={cx + topR} y1={top} x2={cx + botR} y2={bottom} />
      {/* meridians */}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((k) => (
        <line
          key={'m' + k}
          x1={cx + topR * k}
          y1={top + Math.abs(k) * 4}
          x2={cx + botR * k}
          y2={bottom + Math.abs(k) * 2}
          opacity="0.45"
        />
      ))}
      {/* a worldline curving on the cone */}
      <path
        d={`M ${cx - topR * 0.6} ${top + 8} Q ${cx - 20} ${(top + bottom) / 2}, ${cx + botR * 0.2} ${bottom - 4}`}
        stroke={accent}
        strokeWidth="2"
      />
    </g>
  );
}

// ─────────── Slider chrome (interactive — glows) ───────────
function Slider({ value: initialValue = 0.42, label, valueLabel, ticks = 5, accent }) {
  const { theme } = useTheme();
  const useAccent = accent || theme.ink;
  const [value, setValue] = lmUseState(initialValue);
  const [hover, setHover] = lmUseState(false);
  const trackRef = lmUseRef(null);

  const onDrag = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setValue(next);
  };
  const onMouseDown = (e) => {
    onDrag(e);
    const move = (ev) => onDrag(ev);
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '0.18em', color: theme.ink, opacity: 0.75, textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: mono, fontSize: 11.5, color: theme.ink, opacity: 0.65 }}>{valueLabel || value.toFixed(2)}</span>
      </div>
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        style={{ position: 'relative', height: 20, cursor: 'pointer' }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 9, height: 1, background: theme.ink, opacity: 0.22 }} />
        <div style={{ position: 'absolute', left: 0, top: 9, height: 1, width: `${value * 100}%`, background: useAccent, opacity: 0.9 }} />
        {Array.from({ length: ticks }).map((_, k) => (
          <div key={k} style={{ position: 'absolute', left: `${(k / (ticks - 1)) * 100}%`, top: 5, width: 1, height: 9, background: theme.ink, opacity: 0.32 }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: `${value * 100}%`,
            top: 1,
            width: 18, height: 18, borderRadius: 18,
            background: theme.paper,
            border: `1.5px solid ${useAccent}`,
            transform: 'translateX(-50%)',
            boxShadow: `0 0 ${hover ? 14 : 8}px ${useAccent}55, inset 0 0 0 3px ${useAccent}`,
            transition: 'box-shadow 0.2s',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

// ─────────── Button (interactive — glows on hover) ───────────
function Button({ children, primary = false, onClick, style = {} }) {
  const { theme } = useTheme();
  const [hover, setHover] = lmUseState(false);
  const bg = primary ? theme.ink : 'transparent';
  const fg = primary ? theme.paper : theme.ink;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg,
        color: fg,
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 17,
        border: primary ? 'none' : `1px solid ${hover ? theme.ink : theme.inkFaint}`,
        padding: '10px 22px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, background 0.2s, border-color 0.2s, color 0.4s',
        boxShadow: hover ? `0 0 0 4px ${theme.glow1}` : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─────────── Kicker (small uppercase label) ───────────
function Kicker({ children, opacity = 0.6, style = {} }) {
  const { theme } = useTheme();
  return (
    <div style={{
      fontFamily: mono, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: theme.ink, opacity, fontWeight: 500, ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, {
  Typewriter, SectionRule, Stamp, Wordmark, Swatch, TypeSpecimen,
  STDiagram, STMini, ConeShape, Slider, Button, Kicker,
  lmMono: mono, lmSerif: serif,
});
