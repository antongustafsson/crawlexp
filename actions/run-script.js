const vm = require('vm')
const fs = require('fs')
const path = require('path')

module.exports = (context, arguments, _, executionContext) => new Promise((resolve, reject) => {
    const { entrypointFilepath } = executionContext
    const code = fs.readFileSync(path.resolve(path.parse(entrypointFilepath).dir, arguments.script))
    const sandbox = vm.createContext({ context, arguments })
    try {
        vm.runInContext(code, sandbox)
    } catch (e) {
        
    }
    resolve(sandbox.context || {})
})