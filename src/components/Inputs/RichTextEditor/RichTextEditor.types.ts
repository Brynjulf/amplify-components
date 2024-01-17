export enum RichTextEditorFeatures {
  HISTORY = 'history',
  FORMATTING = 'formatting',
  HEADERS = 'headers',
  LISTS = 'lists',
  TEXT_COLOR = 'text-color',
  CODE = 'code',
  ALIGNMENT = 'alignment',
  LINKS = 'links',
  IMAGES = 'images',
  CLEAR_FORMATTING = 'clear-formatting',
}

export const DEFAULT_FEATURES = [
  RichTextEditorFeatures.HISTORY,
  RichTextEditorFeatures.FORMATTING,
  RichTextEditorFeatures.HEADERS,
  RichTextEditorFeatures.LISTS,
  RichTextEditorFeatures.TEXT_COLOR,
  RichTextEditorFeatures.CODE,
  RichTextEditorFeatures.ALIGNMENT,
  RichTextEditorFeatures.LINKS,
  RichTextEditorFeatures.CLEAR_FORMATTING,
];
