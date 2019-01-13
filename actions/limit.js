module.exports = (context, arguments) => new Promise((resolve, reject) => {
    if (context.type === 'strings') {
        const count = Math.max(0, parseInt(arguments.count)) || Infinity
        resolve({ type: 'strings', contents: context.contents.slice(0, count) })
    }
})