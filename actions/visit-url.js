const fetch = require('node-fetch')

module.exports = (context, arguments) => { // context: image
    return new Promise((resolve, reject) => {
        const { url } = arguments
        const urls = context.contents || []
        if (url) urls.unshift(url)

        const promises = []
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]
            const promise = fetch(url).then(response => response.text())
            promises.push(promise)
        }
        Promise.all(promises).then(htmlContents => resolve({ type: 'strings', contents: htmlContents }))
    })
}