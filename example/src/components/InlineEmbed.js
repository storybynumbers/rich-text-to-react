import React from 'react'

const InlineEmbed = ({ node }) => {
    // Here you can place your custom inline embed handling.
    return (
        <span style={{
            margin: '0px 5px',
            padding: '0 .25rem 0 .75rem',
            border: '1px solid #d3dce0',
            fontFamily: 'monospace'
        }}>A custom rendering of sys.id: {node.data.target.sys.id}</span>
    )
}
export default InlineEmbed