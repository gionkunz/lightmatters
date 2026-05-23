// theme.jsx — light / dark palettes + shared toggle
// All artboards subscribe to the same store, so toggling on any one
// switches all of them in lockstep.

const lmThemes = {
  light: {
    name: 'light',
    paper: '#f6f5f1',
    paperAlt: '#eeede8',
    surface: '#ecebe5',
    surfaceSunken: '#e3e1da',
    ink: '#14141a',
    inkSoft: '#54545e',
    inkMid: 'rgba(20,20,26,0.55)',
    inkFaint: 'rgba(20,20,26,0.14)',
    inkVeryFaint: 'rgba(20,20,26,0.07)',
    accent1: 'oklch(0.5 0.18 28)',
    accent2: 'oklch(0.46 0.16 252)',
    glow1: 'oklch(0.5 0.18 28 / 0.28)',
    glow2: 'oklch(0.46 0.16 252 / 0.28)',
    glowInk: 'rgba(20,20,26,0.16)',
  },
  dark: {
    name: 'dark',
    paper: '#0a0c11',
    paperAlt: '#10131a',
    surface: '#13161f',
    surfaceSunken: '#0f1118',
    ink: '#ece4d6',
    inkSoft: '#a39a8b',
    inkMid: 'rgba(236,228,214,0.55)',
    inkFaint: 'rgba(236,228,214,0.13)',
    inkVeryFaint: 'rgba(236,228,214,0.06)',
    accent1: 'oklch(0.76 0.13 28)',
    accent2: 'oklch(0.78 0.08 220)',
    glow1: 'oklch(0.76 0.13 28 / 0.55)',
    glow2: 'oklch(0.78 0.08 220 / 0.5)',
    glowInk: 'rgba(236,228,214,0.22)',
  },
};

const lmThemeStore = (() => {
  let current = 'light';
  const listeners = new Set();
  return {
    get current() { return current; },
    set(next) {
      if (current !== next) {
        current = next;
        listeners.forEach((fn) => fn(current));
      }
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

function useTheme() {
  const [name, setName] = React.useState(lmThemeStore.current);
  React.useEffect(() => lmThemeStore.subscribe(setName), []);
  return {
    theme: lmThemes[name],
    name,
    toggle: () => lmThemeStore.set(name === 'light' ? 'dark' : 'light'),
    setTheme: (n) => lmThemeStore.set(n),
  };
}

// Floating toggle. Renders absolutely-positioned (containing parent
// needs position:relative). Interactive elements glow on hover — this
// is one of those interactive elements.
function ThemeToggle({ style = {}, dot = true }) {
  const { name, toggle, theme } = useTheme();
  const [hover, setHover] = React.useState(false);
  const mono = "'IBM Plex Mono', monospace";
  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'transparent',
        border: `1px solid ${hover ? theme.ink : theme.inkFaint}`,
        color: theme.ink,
        fontFamily: mono,
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 500,
        padding: '8px 14px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        transition: 'border-color 0.18s, box-shadow 0.2s, color 0.4s',
        boxShadow: hover ? `0 0 0 4px ${theme.glow1}` : 'none',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 8, height: 8, borderRadius: 8,
            background: theme.accent1,
            boxShadow: `0 0 ${hover ? 14 : 7}px ${theme.glow1}`,
            transition: 'box-shadow 0.2s',
          }}
        />
      )}
      {name === 'light' ? 'light' : 'dark'}
    </button>
  );
}

Object.assign(window, { lmThemes, useTheme, ThemeToggle });
