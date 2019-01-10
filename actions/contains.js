module.exports = (context, arguments) => new Promise((resolve, reject) => {
    if (context.type === 'strings') {
        resolve({ type: 'strings', contents: context.contents.filter(string => string.indexOf(arguments.text) > -1) })
    }
})