const path = require('path')

module.exports = (context, arguments, _, executionContext) => new Promise((resolve, reject) => {
    const { entrypointFilepath } = executionContext
    const newContext = Object.assign({}, context, {
        summon: path.resolve(path.parse(entrypointFilepath).dir, arguments.behaviour),
    })
    resolve(newContext)
})