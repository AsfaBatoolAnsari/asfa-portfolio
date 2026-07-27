import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

/** Converts a raw CSS declaration string (e.g. from a design export's inline
 * style="...") into a React style object, so hundreds of inline styles can be
 * ported verbatim instead of hand-transcribed. */
export function sx(css: string): CSSProperties {
  const hit = cache.get(css);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith('--')
      ? prop
      : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = val;
  }
  const obj = out as CSSProperties;
  cache.set(css, obj);
  return obj;
}
