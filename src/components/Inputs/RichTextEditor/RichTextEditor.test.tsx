import { faker } from '@faker-js/faker';
import { fireEvent } from '@testing-library/dom';

import RichTextEditor, { RichTextEditorProps } from './RichTextEditor';
import {
  DEFAULT_FEATURES,
  RichTextEditorFeatures,
} from './RichTextEditor.types';
import {
  ClipboardDataMock,
  ClipboardEventMock,
  DragEventMock,
  FakeDOMRectList,
  mockGetBoundingClientRect,
} from 'src/tests/mockRichTextEditor';
import { render, screen, userEvent } from 'src/tests/test-utils';

vi.stubGlobal('ClipboardEvent', ClipboardEventMock);
vi.stubGlobal('ClipboardData', ClipboardDataMock);
vi.stubGlobal('DragEvent', DragEventMock);

document.elementFromPoint = (): null => null;
HTMLElement.prototype.getBoundingClientRect = mockGetBoundingClientRect;
HTMLElement.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList();
Range.prototype.getBoundingClientRect = mockGetBoundingClientRect;
Range.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList();

function fakeProps(withImage = false): RichTextEditorProps {
  return {
    value: faker.animal.fish(),
    onChange: vi.fn(),
    onImageUpload: withImage ? vi.fn() : undefined,
  };
}

function randomFeatures(amount: number): RichTextEditorFeatures[] {
  return faker.helpers.arrayElements(DEFAULT_FEATURES, amount);
}

test('Shows text that is input', async () => {
  const props = fakeProps(true);
  render(<RichTextEditor {...props} />);

  expect(screen.getByText(props.value || '')).toBeInTheDocument();
});

test('Throws error if providing RichTextEditorFeature.IMAGES but not an image handler', () => {
  console.error = vi.fn();

  const props = fakeProps();
  expect(() =>
    render(
      <RichTextEditor
        {...props}
        extendFeatures={[RichTextEditorFeatures.IMAGES]}
      />
    )
  ).toThrowError();
});

test("Throws error if specifying 'features' and 'extendFeatures' / 'removeFeatures'", () => {
  console.error = vi.fn();

  const props = fakeProps();

  expect(() =>
    render(
      <RichTextEditor
        {...props}
        features={randomFeatures(5)}
        extendFeatures={randomFeatures(4)}
      />
    )
  ).toThrowError();

  expect(() =>
    render(
      <RichTextEditor
        {...props}
        features={randomFeatures(5)}
        removeFeatures={randomFeatures(4)}
      />
    )
  ).toThrowError();
});

test("Throws error if 'features' is empty", () => {
  console.error = vi.fn();

  const props = fakeProps();

  expect(() =>
    render(<RichTextEditor {...props} removeFeatures={DEFAULT_FEATURES} />)
  ).toThrowError();
  expect(() =>
    render(<RichTextEditor {...props} features={[]} />)
  ).toThrowError();
});

test("Calls 'onChange' when inputting text", async () => {
  const props = fakeProps();

  const { container } = render(
    <RichTextEditor
      {...props}
      removeFeatures={[RichTextEditorFeatures.IMAGES]}
    />
  );

  let textInput = container.querySelector('.tiptap');

  expect(textInput).not.toBeNull();

  textInput = textInput as Element;

  const randomFish = faker.animal.fish();
  fireEvent.change(textInput, {
    target: { textContent: randomFish },
  });

  expect(screen.getByText(randomFish)).toBeInTheDocument();
});

test('Setting color works as expected', async () => {
  const props = fakeProps();

  const { container } = render(
    <RichTextEditor {...props} features={[RichTextEditorFeatures.TEXT_COLOR]} />
  );

  const colorInput = container.querySelector('input') as Element;

  fireEvent.input(colorInput, { target: { value: '#333333' } });
});

test('Calls onImageUpload as expected', async () => {
  const props = fakeProps(true);

  const { container } = render(
    <RichTextEditor {...props} features={[RichTextEditorFeatures.IMAGES]} />
  );
  const user = userEvent.setup();

  const uploadInput = container.querySelector('input') as HTMLElement;

  const fakeFile = new File(
    ['hei'],
    `${faker.animal.dog()}.${faker.system.fileExt('image/png')}`,
    { type: 'image/png' }
  );
  await user.upload(uploadInput, fakeFile);

  expect(props.onImageUpload).toHaveBeenCalledWith(fakeFile);
});

test('Open file dialog', async () => {
  const props = fakeProps(true);

  render(
    <RichTextEditor {...props} features={[RichTextEditorFeatures.IMAGES]} />
  );
  const user = userEvent.setup();

  const uploadButton = screen.getByRole('button');

  await user.click(uploadButton);
});

test('Creating table works as expected', async () => {
  const props = fakeProps();

  render(
    <RichTextEditor {...props} features={[RichTextEditorFeatures.TABLE]} />
  );
  const user = userEvent.setup();

  const tableButton = screen.getByRole('button');

  await user.click(tableButton);

  expect(screen.getByRole('table')).toBeInTheDocument();
});
