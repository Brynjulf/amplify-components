import HourglassProgress, { HourglassProgressProps } from './HourglassProgress';

import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { tokens } from '@equinor/eds-tokens';

const { colors } = tokens;
test('Renders with correct color when given prop', () => {
  const { container } = render(<HourglassProgress color="primary" />);

  const svgs = container.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[0];
    expect(svg.getAttribute('fill')).toBe(
      colors.interactive.primary__resting.hex
    );
  }
});

test('Render correct size when given prop', () => {
  const size = faker.helpers.arrayElement([
    16, 24, 32, 40, 48,
  ]) as HourglassProgressProps['size'];
  const { container } = render(<HourglassProgress size={size} />);

  const svgs = container.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[0];
    expect(svg).toHaveAttribute('viewBox', `0 0 ${size} ${size}`);
  }
});
