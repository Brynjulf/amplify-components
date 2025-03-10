import { faker } from '@faker-js/faker';

import Colorbox from './Colorbox';
import { render, screen } from 'src/tests/test-utils';

test('Renders Colorbox correctly', async () => {
  const color = faker.color.rgb();
  render(<Colorbox data-testid="colorbox" $color={color} />);

  expect(screen.getByTestId('colorbox')).toHaveStyleRule(
    'background-color',
    color
  );
});
