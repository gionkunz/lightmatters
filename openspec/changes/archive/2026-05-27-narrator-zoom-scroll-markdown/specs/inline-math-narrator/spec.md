## ADDED Requirements

### Requirement: Markdown emphasis coexists with inline LaTeX

Narrate strings MAY combine `$...$` inline LaTeX and Markdown emphasis (`**...**`, `*...*`) in the same sentence. Math delimiters SHALL take precedence: content inside `$...$` is parsed as LaTeX only and SHALL NOT interpret `*` or `**` as Markdown. Emphasis parsing applies only to text segments outside math delimiters.

#### Scenario: Bold word adjacent to inline math

- **WHEN** a narrate string is `The factor $\\\\gamma$ is **large**.`
- **THEN** `$\\\\gamma$` typesets via MathJax as an atomic math block
- **AND** `large` renders bold after the math block reveals
- **AND** no raw `$`, `*`, or `**` markers appear in the final output

#### Scenario: Asterisks inside math are not Markdown

- **WHEN** a narrate string is `$x^* y^*$`
- **THEN** the entire expression is treated as one LaTeX segment
- **AND** MathJax typesets the superscript asterisks as math notation

## MODIFIED Requirements

### Requirement: Narrate strings support inline LaTeX delimiters

Narrate event `text` fields SHALL support inline LaTeX wrapped in `$...$` delimiters and inline Markdown emphasis (`**...**`, `*...*`) in text segments outside math delimiters. Text outside delimiters SHALL render with the existing letter-by-letter typewriter, including styled emphasis spans. Content inside `$...$` delimiters SHALL render as typeset math via MathJax.

#### Scenario: Plain text without delimiters is unchanged

- **WHEN** a narrate event text contains no `$` delimiters or Markdown emphasis
- **THEN** the narrator reveals the text character-by-character as before
- **AND** MathJax is not loaded

#### Scenario: Inline LaTeX renders via MathJax

- **WHEN** a narrate event text contains `$\\gamma$`
- **AND** the typewriter reaches the math segment
- **THEN** MathJax typesets the LaTeX as inline CHTML
- **AND** the formula appears as a single atomic reveal (not character-by-character)
