import { faker } from '@faker-js/faker';

import { render, screen } from '../../../tests/test-utils';
import WorkflowStatusBar, { WorkflowStatusBarProps } from './WorkflowStatusBar';

function fakeOption() {
  return {
    color: faker.color.rgb(),
    backgroundColor: faker.color.rgb(),
    label: faker.animal.lion(),
    value: faker.string.uuid(),
  };
}

function fakeProps(
  highlightActiveNode = false,
  showAlert = false
): WorkflowStatusBarProps {
  const options: any = [];
  for (let i = 0; i < faker.number.int({ min: 2, max: 10 }); i++) {
    options.push(fakeOption());
  }
  return {
    options,
    activeNode: options[1].value,
    showAlert,
    highlightActiveNode,
  };
}

test('Shows expected colors on nodes', async () => {
  const props = fakeProps(true);
  render(<WorkflowStatusBar {...props} />);

  const options = screen.getAllByTestId('workflow-option');
  for (const [index, option] of options.entries()) {
    const colorIndex = option.children.length - 1;
    expect(option.children[colorIndex]).toHaveStyleRule(
      'background-color',
      props.options[index].backgroundColor
    );
    expect(option.children[colorIndex]).toHaveStyleRule(
      'border',
      `0.125em solid ${props.options[index].color}`
    );
  }
});

test('Shows expected active node', async () => {
  const props = fakeProps(true);
  render(<WorkflowStatusBar {...props} />);

  const activeEl = screen.getByTestId('active');
  expect(activeEl).toBeInTheDocument();
});

test('Shows expected alert node', async () => {
  const props = fakeProps(false, true);
  render(<WorkflowStatusBar {...props} />);

  const alertEl = screen.getByTestId('alert');
  expect(alertEl).toBeInTheDocument();
});

test('Works with disabledTooltip = true ', async () => {
  const props = fakeProps(false, false);
  render(<WorkflowStatusBar {...props} disableTooltip />);

  const options = screen.getAllByTestId('workflow-option');
  for (const [index, option] of options.entries()) {
    const colorIndex = option.children.length - 1;
    expect(option.children[colorIndex]).toHaveStyleRule(
      'border',
      `0.125em solid ${props.options[index].color}`
    );
  }
});
