# rich-text-to-react

> Render a Contentful rich text field with React components.

Warning: this is in alpha state, and this is not an official Contentful module. It is largely based off their [rich-text-html-renderer](https://github.com/contentful/rich-text#readme) library. Its purpose is to map node of a [Rich Text field from Contentful](https://www.contentful.com/developers/docs/concepts/rich-text/) to customizable React components.

[![NPM](https://img.shields.io/npm/v/rich-text-to-react.svg)](https://www.npmjs.com/package/rich-text-to-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save rich-text-to-react
```

## Usage

```javascript
import RichTextToReact from 'rich-text-to-react';
import SampleRichFieldData from './data'

export default () => (
  <RichTextToReact document={SampleRichFieldData.json} />
)
```

## Custom renderers

You can also pass custom renderers for both marks and nodes:

```javascript
import RichTextToReact from 'rich-text-to-react';
import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types';
import MyCustomComponent from '~/components/MyCustomComponent'

const renderingOptions = {
  renderMark: {
    // Render all bold text in red.
    [MARKS.BOLD]: (text, key) => <strong key={key} style={{ color: 'red' }}>{text}</strong>
  },
  renderNode: {
    // Pass the node data for the inline embed to MyCustomComponent.
    [INLINES.EMBEDDED_ENTRY]: (node, key, next, options) => <MyInlineComponent key={key} node={node} {...options} />,
    [BLOCKS.EMBEDDED_ENTRY]: (node, key, next, options) => <MyBlockComponent key={key} node={node} {...options} />,
    [BLOCKS.HEADING_1]: (node, key, next) => <Heading key={key} as="h1">{next(node.content, key, next)}</Heading>,
  },
  foo: 'bar',
}

export default () => (
  <RichTextToReact document={myFieldValue.json} options={renderingOptions} />
)
```

The object passed to RichTextToReact's `options` prop should have two keys, `renderMark` and `renderNode`, each containing objects. Those objects
should be keyed with Rich Text types (see next section) to assign rendering functions with a type of a Rich Text node (heading, list item, link).

Rendering functions are passed the following arguments:

- `node` - Section of the Rich Text document being processed
- `key` - Unique key used internally by React
- `next` - Utility function to iterate through the Rich Text document
- `options` - Any additional properties (everything except renderMark and renderNode) will be passed here. In the example above, MyInlineComponent will receive the prop 'foo' with value 'bar'.


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
