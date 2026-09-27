# OSP footer

Fresh standalone implementation with no framework or build dependencies.

## Preview

Run `python -m http.server 4173` from this directory, then open http://localhost:4173. Use HTTP so the SVG icon sprite loads correctly.

## Before deployment

- `assets/osp-logo.png` is the original metallic logo supplied by the user, preserved without edits.
- Add verified profile URLs to `socialProfiles` in `footer.js`. Until supplied, social labels render as noninteractive text, not guessed links.
- Connect the four company routes in `index.html` to the host site's actual routes.
- Fonts currently load from Google Fonts; self-host Inter and Outfit if required by the host project.

## Integration

Copy the footer markup, assets, stylesheet, and script into the host website. Scope the global reset/font styles as appropriate and remove `min-height: 100svh` from `.osp-footer` when embedding below existing page content. No previous footer or interaction code was used.

## Interaction

Both text layers use identical dimensions, letter spans, and typography. The reveal is a tapered brush made from 12 overlapping text-clipped gradients. A time-adjusted requestAnimationFrame loop makes each dab follow the preceding one, with bounded spacing to keep fast movements continuous. Each painted dab holds for 2000 ms, then fades over 1400 ms in chronological order. New paint is clipped only to the active glyph; earlier glyphs retain their own dated paint. The native cursor stays visible. The animation loop stops after the brush settles and all paint expires. A 180-dab limit bounds rendering cost. Cached span offsets keep every gradient aligned with the shared stage.

The animated trail is enabled for mouse, touch, and pen, without an activation control or motion-preference gate. On mobile, a smaller brush follows the primary finger while it touches the lettering; lifting or cancelling the contact stops new strokes while existing paint finishes fading. Horizontal strokes animate while vertical scrolling and pinch zoom remain native (`touch-action: pan-y pinch-zoom`). When the browser takes over scrolling, cancellation stops new strokes. Pointer exit, scrolling, and window blur let existing paint finish fading. Resize and page hiding clear all paint to avoid stale geometry and background work. No canvas, WebGL, animation libraries, or framework state are used.
The giant typography uses a local subset of Outfit 900 named OSP Display. Overlapping font contours are united before export, eliminating internal stroke seams in P without changing the letter silhouette. The SIL OFL license ships alongside it. Rebuild with `tools/build-display-font.py` using the upstream Outfit variable TTF and the fonttools, skia-pathops, and brotli packages. Those tools are build-time only; the website needs no Python dependencies.

A gradient centered in a counter or gap never paints the background. If its radius reaches a nearby glyph, that portion of the glyph can still reveal, as prescribed by the text-clipped radial gradient. A zero-white guarantee for every point inside counters would require additional glyph hit testing beyond this requested technique.
