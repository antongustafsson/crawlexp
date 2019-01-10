module.exports = (context, arguments) => {
    return new Promise((resolve, reject) => {
        const { prefix = '', suffix = '' } = arguments
        resolve({
            type: 'strings',
            contents: context.contents.map((string) => prefix + string + suffix)
        })
    })
}