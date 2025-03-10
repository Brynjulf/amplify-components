import { cleanup } from '@testing-library/react';

import { afterEach, beforeAll } from 'vitest';

import '@testing-library/jest-dom';
import 'jest-styled-components';

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  HTMLDialogElement.prototype.show = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});
