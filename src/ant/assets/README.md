# Ant Rig Assets

Source: `src/ant/from-this-image--please-separate-the-arms-and-legs.png`

Required exported assets:
- `head`
- `torso`
- `left-arm`
- `right-arm`
- `left-leg`
- `right-leg`
- `tail`
- `antenna-left`
- `antenna-right`

Each part must:
- use transparency
- be cropped consistently
- preserve the same visual proportions as the source image

Before wiring GSAP transforms, record the pivot notes for each exported part.

Runtime notes:
- `AntCharacter.ready()` blocks the intro until every `[data-part]` image has finished loading.
- If a PNG part is later replaced with SVG, keep the same filename, crop bounds, and pivot contract.
- For browser QA, `/?qa=auto` skips the hold interaction and accelerates delays. `/?qa=auto&select=c` also auto-selects an action tile after the guided reveal.
