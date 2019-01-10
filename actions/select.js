module.exports = (context, arguments) => {
    return new Promise((resolve, reject) => {
        const { start = null, end = null, index = null } = arguments
        resolve({
            type: 'strings',
            contents: (() => {
                if (start !== null && end !== null) {
                    return context.contents.slice(parseInt(start), parseInt(end))
                } else if (index !== null) {
                    return [
                        context.contents[parseInt(index)]
                    ]
                }
                return context.contents
            })()
        })
    })
}