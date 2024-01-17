import { tokens } from '@equinor/eds-tokens';

import styled from 'styled-components';

import 'highlight.js/styles/github-dark-dimmed.css';

const { colors, typography, spacings } = tokens;

export const Wrapper = styled.div`
  .tiptap {
    height: 100%;
    min-height: 200px;
    box-shadow: inset 0 -1px ${colors.ui.background__medium.rgba};
    padding: 0 ${spacings.comfortable.medium};

    p {
      font-size: 16px;
      font-family: 'Equinor', sans-serif;
      color: ${colors.text.static_icons__default.hex};
    }
    h1 {
      font-size: ${typography.heading.h4.fontSize};
      font-weight: ${typography.heading.h4.fontWeight};
      line-height: ${typography.heading.h4.lineHeight};
      color: ${colors.text.static_icons__default.hex};
      font-family: ${typography.heading.h4.fontFamily};
    }
    h2 {
      font-size: ${typography.heading.h5.fontSize};
      font-weight: ${typography.heading.h5.fontWeight};
      line-height: ${typography.heading.h5.lineHeight};
      color: ${colors.text.static_icons__default.hex};
      font-family: ${typography.heading.h5.fontFamily};
    }
    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 5px;
    }
    pre {
      background: #0d0d0d;
      border-radius: 0.5rem;
      color: #fff;
      font-family: 'Equinor Mono', monospace;
      padding: 0.75rem 1rem;

      code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }
    }

    &:focus-visible {
      outline: none;
      box-shadow: inset 0 -2px ${colors.interactive.primary__resting.rgba};
    }
  }
  .tiptap p.is-editor-empty:first-child::before {
    color: #565656;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;
