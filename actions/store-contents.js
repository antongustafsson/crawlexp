const fs = require('fs')
const path = require('path')

module.exports = (context, arguments, _, executionContext) => {
    return new Promise((resolve, reject) => {
        const { entrypointFilepath } = executionContext
        const storagePath = path.resolve(path.parse(entrypointFilepath || process.mainModule.filename).dir, 'files')
        const filePath = path.resolve(storagePath, arguments.filename)
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath)
        }

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '')
        }

        context.contents.forEach(content => {
            fs.appendFileSync(filePath, `${content}\n`)
        })
        resolve({ type: 'empty' })
    })
}