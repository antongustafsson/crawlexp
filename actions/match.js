module.exports = (expression) => (context, arguments) => new Promise((resolve) => {
    if (context.type === 'strings') {
        const limit = Math.max(0, parseInt(arguments.limit)) || Infinity
        const regexp = new RegExp(expression || arguments.expression, 'g')
        const matches = []
        for (let i = 0; i < context.contents.length; i++) {
            const contentItem = context.contents[i]
            let match = null
            do {
                match = regexp.exec(contentItem)
                if (match) {
                    matches.push(match[0])
                }
            } while (match && matches.length < limit)
        }
        if (matches.length > 0) {
            resolve({ type: 'strings', contents: matches })
        } else {
            resolve({ type: 'empty' })
        }
    }
})