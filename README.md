# rich-text-to-react

> Map a Contentful rich text field to React component tree.

Warning: this is in alpha state, and this is not an official Contentful module. It is largely based off their [rich-text-html-renderer](https://github.com/contentful/rich-text#readme) library.

[![NPM](https://img.shields.io/npm/v/rich-text-to-react.svg)](https://www.npmjs.com/package/rich-text-to-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save rich-text-to-react
```

## Usage

```javascript
import RichText from '@storybynumbers/rich-text-to-react';
import SampleRichFieldData from './data'

export default () => (
  <RichText document={SampleRichFieldData.json} />
)
```

## Custom renderers

You can also pass custom renderers for both marks and nodes:

```javascript
import RichTextToReact from '@storybynumbers/rich-text-to-react';
import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types';
import MyCustomComponent from '~/components/MyCustomComponent'

const options = {
  renderMark: {
    // Render all bold text in red.
    [MARKS.BOLD]: (text, key) => <strong key={key} style={{ color: 'red' }}>{text}</strong>
  },
  renderNode: {
    // Pass the node data for the inline embed to MyCustomComponent.
    [INLINES.EMBEDDED_ENTRY]: (node, key) => <MyCustomComponent key={`RichText-${key}`} node={node> />
  }
}

export default () => (
  <RichTextToReact document={myFieldValue.json} options={options} />
)
```

## Rich Text types

The `renderNode` keys should be one of the following `BLOCKS` and `INLINES` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BLOCKS`
  - `DOCUMENT`
  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `HEADING_4`
  - `HEADING_5`
  - `HEADING_6`
  - `UL_LIST`
  - `OL_LIST`
  - `LIST_ITEM`
  - `QUOTE`
  - `HR`
  - `EMBEDDED_ENTRY`
  - `EMBEDDED_ASSET`

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`

The `renderMark` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`

## License

MIT © [storybynumbers](https://github.com/storybynumbers)
