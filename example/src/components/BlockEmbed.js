import React from 'react'

const BlockPageTeaser = ({key, title, slug, lang}) => (
    <div style={{width: 300, backgroundColor: "#eee", textAlign: "center", padding: 20}}>
        {lang == 'en' && 'english'}
        {lang == 'nl' && 'nederlands'}
        <a href={`/${slug}`}>{title}</a>
    </div>
)
// const BlockImage = ({image, caption, format}) => (
//     <div>
//         <img src={image.url} />
//         {caption && <div>{caption}</div>}
//     </div>
// )

const BlockEmbed = ({ node, renderer }) => {
    const { links, optionsForComponents } = renderer;
    const linkedEntry = links.entries.block.find(block => block.sys.id === node.data.target.sys.id)

    // Here you can place your custom embed handling based on content type
    switch (linkedEntry.__typename) {
        case "Page": 
            return <BlockPageTeaser {...linkedEntry} lang={optionsForComponents.siteLanguage} />
        // case "BlockImage": 
        //     return <BlockImage {...linkedEntry} />
        default: 
            return <div>[embedded entry {node.data.target.sys.id}]</div>
    }
    return 'test'
}
export default BlockEmbed