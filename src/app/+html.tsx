import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { ReactNode } from 'react';

/**
 * The web build's root document (`web.output: 'static'`). It renders in Node at
 * build / request time only — no DOM, no browser APIs — and wraps every page.
 *
 * It is Expo's default document plus two things the canvas's root sets and the
 * browser would otherwise not (design-system §1, §10.12):
 *
 *  - `-webkit-font-smoothing: antialiased` on the root. Every frame declares it,
 *    and on macOS it is the difference between subpixel and greyscale glyph
 *    edges — residue in every pixel diff of text otherwise. (`_layout.tsx` also
 *    sets it on the app's root view; this covers what paints outside that view,
 *    and the first paint before it mounts.)
 *  - the `#0D0D0D` ground on `html` / `body`, so nothing white flashes before the
 *    first screen paints, behind an overscroll, or around a keyboard.
 *
 * Deliberately not `color-scheme: dark`: it changes the browser's default text,
 * caret and control colours under RN-web's own styles, which the frames never
 * asked for.
 */
const ROOT_CSS = `html,body{background-color:#0D0D0D;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}`;

export default function Root({ children }: { children: ReactNode }) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();
  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#0D0D0D" />
        {/* Body scrolling off, so ScrollViews behave as they do on native. */}
        <ScrollViewStyleReset />
        <style id="vici-root" dangerouslySetInnerHTML={{ __html: ROOT_CSS }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
