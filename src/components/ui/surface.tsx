import { createContext, useContext, type ReactNode } from 'react';

/**
 * Surface context — lets text and controls adapt to the surface they sit on
 * without every call-site passing colours. `'paper'` is the calm light field
 * (the default); `'ink'` is the signature near-black hero surface.
 *
 * `Card tone="ink"` wraps its children in `<InkSurface>`, so any `AppText`,
 * `Button`, or `Pill` inside automatically flips to the light-on-ink treatment.
 */
export type Surface = 'paper' | 'ink';

const SurfaceContext = createContext<Surface>('paper');

export function InkSurface({ children }: { children: ReactNode }) {
  return <SurfaceContext.Provider value="ink">{children}</SurfaceContext.Provider>;
}

export function PaperSurface({ children }: { children: ReactNode }) {
  return <SurfaceContext.Provider value="paper">{children}</SurfaceContext.Provider>;
}

/** Current surface ('paper' | 'ink'). */
export function useSurface(): Surface {
  return useContext(SurfaceContext);
}

/** Convenience: true when the current surface is the ink hero surface. */
export function useOnInk(): boolean {
  return useContext(SurfaceContext) === 'ink';
}
