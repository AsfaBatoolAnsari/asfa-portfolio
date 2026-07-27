import type { CSSProperties, ElementType, ReactNode } from 'react';
import { sx } from '../lib/sx';
import { useHover } from '../lib/useHover';

interface HoverableProps {
  as?: ElementType;
  base: string;
  hoverCss?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any;
}

/** Renders `as` (default 'div') with `base` CSS applied always and `hoverCss`
 * merged in on hover — the React equivalent of the design export's
 * `style="..." style-hover="..."` attribute pair. */
export function Hoverable({ as, base, hoverCss, style, children, ...rest }: HoverableProps) {
  const Tag = (as || 'div') as ElementType;
  const { hover, hoverProps } = useHover();
  const merged: CSSProperties = { ...sx(base), ...style, ...(hover && hoverCss ? sx(hoverCss) : {}) };
  return (
    <Tag style={merged} {...hoverProps} {...rest}>
      {children}
    </Tag>
  );
}
