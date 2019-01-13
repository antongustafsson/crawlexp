const fetch = require('node-fetch')

module.exports = (context, arguments, fetchQueue) => { // context: image
    return new Promise((resolve, reject) => {
        const { url } = arguments
        const urls = context.contents || []
        if (!context.contents || context.contents.length < 1) {
            if (url) urls.unshift(url)
        }

        const promises = []
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]
            const promise = new Promise(resolve => {
                const fetchArgs = { url }
                if (arguments.timeout) {
                    fetchArgs.timeout = parseInt(arguments.timeout)
                }
                fetchQueue.push(fetchArgs, resolve)
            })
            promises.push(promise)
        }
        Promise.all(promises).then(htmlContents => {
            resolve({ type: 'strings', contents: htmlContents })
        })
    })
}