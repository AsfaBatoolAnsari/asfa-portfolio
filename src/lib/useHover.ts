import { useState } from 'react';

/** Mirrors the design export's `style-hover="..."` attribute: returns whether
 * the element is hovered plus the mouse handlers to wire onto it. */
export function useHover() {
  const [hover, setHover] = useState(false);
  return {
    hover,
    hoverProps: {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    },
  };
}
