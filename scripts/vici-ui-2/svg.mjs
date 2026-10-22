// SVG markup the app's renderer (react-native-svg) can draw as the browser does.
//
// `paint-order="stroke"` paints an element's stroke before its fill, so the
// fill covers the inner half of the stroke. react-native-svg ignores the
// attribute and paints the stroke last, over the fill, so every "cut" outline
// in the bundle's drawings came out thinner. The same picture without it: a
// stroke-only copy of the element, then the element with its fill and no stroke.
const STROKE_ATTRS = ['stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap', 'stroke-dasharray', 'stroke-opacity', 'stroke-miterlimit'];

const attrsOf = (s) => [...s.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]);
const write = (tag, attrs) => `<${tag} ${attrs.map(([k, v]) => `${k}="${v}"`).join(' ')}></${tag}>`;

export function unPaintOrder(markup) {
  return markup.replace(/<(rect|circle|ellipse|path|line|polyline|polygon)\b([^>]*?)\s*\/?>(?:<\/\1>)?/g, (whole, tag, rest) => {
    const attrs = attrsOf(rest);
    const po = attrs.find(([k]) => k === 'paint-order');
    if (!po || !/^stroke/.test(po[1])) return whole;
    const base = attrs.filter(([k]) => k !== 'paint-order');
    const strokeOnly = [...base.filter(([k]) => k !== 'fill' && k !== 'fill-opacity'), ['fill', 'none']];
    const fillOnly = [...base.filter(([k]) => !STROKE_ATTRS.includes(k)), ['stroke', 'none']];
    return write(tag, strokeOnly) + write(tag, fillOnly);
  });
}
