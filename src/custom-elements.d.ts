import type React from 'react';

type AnyEl = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'image-slot': AnyEl;
      'soft-aurora': AnyEl;
      'grainient-bg': AnyEl;
      'light-rays': AnyEl;
      'galaxy-bg': AnyEl;
      'magic-rings': AnyEl;
      'falling-text': AnyEl;
    }
  }
}

export {};
