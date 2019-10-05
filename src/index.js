import React from 'react'
import {
  BLOCKS,
  MARKS,
  INLINES,
  helpers
} from '@contentful/rich-text-types'

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
  [BLOCKS.EMBEDDED_ENTRY]: (node, key, next) => <div key={key}>{next(node.content, key, next)}</div>,
  [BLOCKS.UL_LIST]: (node, key, next) => <ul key={key}>{next(node.content, key, next)}</ul>,
  [BLOCKS.OL_LIST]: (node, key, next) => <ol key={key}>{next(node.content, key, next)}</ol>,
  [BLOCKS.LIST_ITEM]: (node, key, next) => <li key={key}>{next(node.content, key, next)}</li>,
  [BLOCKS.QUOTE]: (node, key, next) => <blockquote key={key}>{next(node.content, key, next)}</blockquote>,
  [BLOCKS.HR]: (node, key) => <hr key={key} />,
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

const renderNodeList = (nodes, key, renderers) => {
  return nodes.map((node, i) => renderNode(node, `${key}-${i}`, renderers))
}

const renderNode = (node, key, renderers) => {
  const nodeRenderer = renderers.node
  if (helpers.isText(node)) {
    // We're at final tip of node branch, can render text.
    const markerRender = renderers.mark
    return nodeRenderer.text(node, key, markerRender)
  } else {
    const nextNode = nodes => renderNodeList(nodes, key, renderers)
    if (!nodeRenderer) {
      return <div>{`${key} ;lost nodeRenderer`}</div>
    }
    if (!node.nodeType || !nodeRenderer[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return '(Unrecognized node type: ' + node.nodeType + ')'
    }
    return nodeRenderer[node.nodeType](node, key, nextNode, renderers.options)
  }
}

const RichTextToReact = ({ document, options = {} }) => {
  const { renderNode, renderMark, ...renderOptions } = options
  const renderer = {
    node: {
      ...defaultNodeRenderers,
      ...renderNode,
    },
    mark: {
      ...defaultMarkRenderers,
      ...renderMark
    },
    options: {
      ...renderOptions
    }
  }
  if (!document || !document.content) {
    console.error('Invalid document passed to component. Is the entry published?', document)
    return null
  }
  return renderNodeList(document.content, 'RichText-', renderer)
}

export default RichTextToReact
