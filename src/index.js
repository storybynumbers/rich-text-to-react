import React from 'react'
import {
  BLOCKS,
  MARKS,
  INLINES,
  helpers
} from '@contentful/rich-text-types'

const defaultEmbeddedEntry = (node, key, {links}) => {
  // The contents of linkedEntry will be different based on the content type.
  const linkedEntry = links.entries.block.find(block => block.sys.id === node.data.target.sys.id)
  console.log('linked entry for ' + node.data.target.sys.id, linkedEntry)
  return <div key={key}>[embedded entry {node.data.target.sys.id}]</div>
}

const defaultEmbeddedAsset = (node, key, {links}) => {
  // The contents of linkedEntry will be different based on the content type.
  const linkedEntry = links.assets.block.find(block => block.sys.id === node.data.target.sys.id)
  //console.log('linked asset for ' + node.data.target.sys.id, linkedEntry)
  return (
    <div key={key}>
      <div><img src={linkedEntry.url} alt={linkedEntry.title} /></div>
    </div>
  )

}

const defaultInline = (type, node, key) => {
  return <span key={key} style={{
    margin: '0px 5px',
    padding: '0 .25rem 0 .75rem',
    border: '1px solid #d3dce0',
    fontFamily: 'monospace'
  }}>inline: {type} , sys.id: {node.data.target.sys.id}</span>
}

const defaultMarkRenderers = {
  [MARKS.BOLD]: (text, key) => <strong key={key}>{text}</strong>,
  [MARKS.ITALIC]: (text, key) => <em key={key}>{text}</em>,
  [MARKS.UNDERLINE]: (text, key) => <u key={key}>{text}</u>,
  [MARKS.CODE]: (text, key) => <code key={key}>{text}</code>
}

const defaultNodeRenderers = {
  [BLOCKS.PARAGRAPH]: (node, key, next) => <p key={key}>{next(node.content, key, next)}</p>,
  [BLOCKS.HEADING_1]: (node, key, next) => <h1 key={key}>{next(node.content, key, next)}</h1>,
  [BLOCKS.HEADING_2]: (node, key, next) => <h2 key={key}>{next(node.content, key, next)}</h2>,
  [BLOCKS.HEADING_3]: (node, key, next) => <h3 key={key}>{next(node.content, key, next)}</h3>,
  [BLOCKS.HEADING_4]: (node, key, next) => <h4 key={key}>{next(node.content, key, next)}</h4>,
  [BLOCKS.HEADING_5]: (node, key, next) => <h5 key={key}>{next(node.content, key, next)}</h5>,
  [BLOCKS.HEADING_6]: (node, key, next) => <h6 key={key}>{next(node.content, key, next)}</h6>,
  [BLOCKS.UL_LIST]: (node, key, next) => <ul key={key}>{next(node.content, key, next)}</ul>,
  [BLOCKS.OL_LIST]: (node, key, next) => <ol key={key}>{next(node.content, key, next)}</ol>,
  [BLOCKS.LIST_ITEM]: (node, key, next) => <li key={key}>{next(node.content, key, next)}</li>,
  [BLOCKS.QUOTE]: (node, key, next) => <blockquote key={key}>{next(node.content, key, next)}</blockquote>,
  [BLOCKS.HR]: (node, key) => <hr key={key} />,
  [BLOCKS.EMBEDDED_ENTRY]: (node, key, next, renderer) => <div key={key}>{defaultEmbeddedEntry(node, key, renderer)}</div>,  
  [BLOCKS.EMBEDDED_ASSET]: (node, key, next, renderer) => <div key={key}>{defaultEmbeddedAsset(node, key, renderer)}</div>,  
  [INLINES.ASSET_HYPERLINK]: (node, key) => defaultInline(INLINES.ASSET_HYPERLINK, node, key),
  [INLINES.ENTRY_HYPERLINK]: (node, key) => defaultInline(INLINES.ENTRY_HYPERLINK, node, key),
  [INLINES.EMBEDDED_ENTRY]: (node, key) => defaultInline(INLINES.EMBEDDED_ENTRY, node, key),
  [INLINES.HYPERLINK]: (node, key, next) => {
    return (<a href={node.data.uri} key={key}>{next(node.content, key, next)}</a>)
  },
  text: ({ marks, value }, key, markRenderer) => {
    return marks.length ? (
      marks.reduce((aggregate, mark, i) => markRenderer[mark.type](aggregate, `${key}-${i}`), value)
    ) : value
  }
}

const renderNodeList = (nodes, key, renderer) => {
  return nodes.map((node, i) => renderNode(node, `${key}-${i}`, renderer))
}

const renderNode = (node, key, renderer) => {
  if (helpers.isText(node)) {
    // We're at final tip of node branch, can render text.
    return renderer.node.text(node, key, renderer.mark)
  } else {
    const nextNode = nodes => renderNodeList(nodes, key, renderer)
    if (!renderer.node) {
      console.error('lost node renderer', renderer);
      return <div>{`${key} error: lost node renderer`}</div>
    }
    if (!node.nodeType || !renderer.node[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return '(Unrecognized node type: ' + node.nodeType + ')'
    }
    return renderer.node[node.nodeType](node, key, nextNode, renderer)
  }
}

const RichTextToReact = ({ document, options = {} }) => {
  const { renderNode, renderMark, ...optionsForComponents } = options
  if (!document || !document.json || !document.json.content) {
    console.error('Invalid document passed to component. Is the entry published?', document)
    return null
  }
  const renderer = {
    node: {
      ...defaultNodeRenderers,
      ...renderNode,
    },
    mark: {
      ...defaultMarkRenderers,
      ...renderMark
    },
    links: document.links,
    optionsForComponents
  }
  return renderNodeList(document.json.content, 'RichText-', renderer)
}

export default RichTextToReact
