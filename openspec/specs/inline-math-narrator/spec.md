# inline-math-narrator Specification

## Purpose
TBD - created by archiving change inline-math-mathjax. Update Purpose after archive.
## Requirements
### Requirement: Narrate strings support inline LaTeX delimiters

Narrate event `text` fields SHALL support inline LaTeX wrapped in `$...$` delimiters. Text outside delimiters SHALL render with the existing letter-by-letter typewriter. Content inside delimiters SHALL render as typeset math via MathJax.

#### Scenario: Plain text without delimiters is unchanged

- **WHEN** a narrate event text contains no `$` delimiters
- **THEN** the narrator reveals the text character-by-character as before
- **AND** MathJax is not loaded

#### Scenario: Inline LaTeX renders via MathJax

- **WHEN** a narrate event text contains `$\\gamma$`
- **AND** the typewriter reaches the math segment
- **THEN** MathJax typesets the LaTeX as inline CHTML
- **AND** the formula appears as a single atomic reveal (not character-by-character)

### Requirement: MathJax loads lazily

The application SHALL load MathJax only when inline math is first typeset, via an async script at `/mathjax/tex-chtml-nofont.js`.

#### Scenario: MathJax not loaded on pages without math

- **WHEN** a step's timeline contains no `$...$` in narrate strings
- **THEN** the MathJax script is not fetched

#### Scenario: MathJax loads on first inline math

- **WHEN** the narrator reveals the first inline math segment
- **THEN** MathJax is loaded and initialized
- **AND** the math segment is typeset

### Requirement: Timeline accounts for math typing units

The timeline runner SHALL count each inline math block as a fixed number of typing units (default 5) when computing narrate duration and visible-unit progression.

#### Scenario: Math block advances typing units atomically

- **WHEN** a narrate string is `Hi $\\gamma$!`
- **AND** the typewriter has revealed 2 text units (`Hi`)
- **THEN** the next unit reveals the entire math block at once
- **AND** subsequent units continue with remaining text

