import React, { Component } from 'react'
import RichTextToReact from 'rich-text-to-react'
import SampleData from './data'
import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types';
import InlineEmbedHandler from './InlineEmbedHandler'

const options = {
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node, key) => (
      <InlineEmbedHandler key={key} node={node} />
    ),
    [BLOCKS.PARAGRAPH]: (node, key, next) => (
      <p key={key} style={{ border: '#ccc 2px dotted', padding: '15px' }}>
        {next(node.content, key, next)}
      </p>
    )
  },
  renderMark: {
    [MARKS.BOLD]: (text, key) => <strong key={key} style={{ color: 'red' }}>{text}!</strong>
  }
}


export default class App extends Component {
  render () {
    return (
      <div style={{ padding: 20 }}>
        <h1>Rich text to React renderer</h1>
        <h2>Default rendering</h2>
        <RichTextToReact document={SampleData.json}  />
        <h2>Rendering with options</h2>
        <RichTextToReact document={SampleData.json} options={options} />
      </div>
    )
  }
}
