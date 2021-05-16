import React, { Component } from 'react'
import RichTextToReact from 'rich-text-to-react'
import SampleData from './data/richTextWithEmbeds'
import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types';
import InlineEmbed from './components/InlineEmbed'
import BlockEmbed from './components/BlockEmbed'

const options = {
  // Overrides
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node, key) => (
      <InlineEmbed key={key} node={node} />
    ),
    [BLOCKS.PARAGRAPH]: (node, key, next) => (
      <p key={key} style={{ border: '#ccc 2px dotted', padding: '15px' }}>
        {next(node.content, key, next)}
      </p>
    ),
    [BLOCKS.EMBEDDED_ENTRY]: (node, key, next, renderer ) => (
      <BlockEmbed key={key} node={node} renderer={renderer} />  
    )
  },
  renderMark: {
    [MARKS.BOLD]: (text, key) => <strong key={key} style={{ color: 'red' }}>{text}!</strong>
  },
  // All remaining properties are passed through the optionsForComponents property of the renderer,
  // which is handy for trickling down something like the website's current language.
  siteLanguage: 'en'
}


export default class App extends Component {
  render() {
    const css = { margin: '2em 0', border: 'solid 1px #333', padding: '2em' }
    return (
      <div style={{ padding: 20 }}>
        <h1>Rich text to React renderer</h1>
        <h2>Default rendering</h2>
        <div style={css}>
          <RichTextToReact document={SampleData} />
        </div>
        <h2>Rendering with options</h2>
        <div style={css}>
          <RichTextToReact document={SampleData} options={options} />
        </div>
      </div>
    )
  }
}
