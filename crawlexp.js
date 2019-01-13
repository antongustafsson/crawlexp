const vm = require('vm')
const fs = require('fs')
const async = require('async')
const parse = require('./parse')
const fetch = require('node-fetch')
const createActionDictionary = require('./actions')
const actionDictionary = createActionDictionary()

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout))

const fetchQueue = async.queue((task, callback) => {
    let promise = Promise.resolve()
    if (task.timeout !== undefined) {
        promise = promise.then(() => wait(task.timeout))
    }
    promise.then(() => fetch(task.url)
        .then(response => response.text())
        .then(callback).catch(() => callback('')))
}, 1)

const runAction = (name, args, context, executionContext) => {
    if (actionDictionary[name]) {
        return actionDictionary[name](context, args, fetchQueue, executionContext)
    } else {
        throw new Error(`No such action "${name}"`)
    }
}

const resolveArgs = (arguments, context) => {
    const newArgs = {}
    const scriptContext = vm.createContext(context)

    Object.keys(arguments).forEach((key) => {
        try {
            newArgs[key] = vm.runInContext(arguments[key], scriptContext)
        } catch (e) {
            newArgs[key] = arguments[key]
        }
    })
    return newArgs
}

const runActionsAndPropagate = async (actions, context, executionContext) => {
    const runWithContext = (action, context) =>
        runAction(action.name, resolveArgs(action.arguments, context), Object.assign({}, context, { text: action.text }), executionContext)
    const pool = [
        { actions, context }
    ]
    while (pool.length > 0) {
        const currentActionsWithContext = pool[0]
        for (let i = 0; i < currentActionsWithContext.actions.length; i++) {
            const childAction = currentActionsWithContext.actions[i]
            const context = await runWithContext(childAction, currentActionsWithContext.context)
            if (context.summon) {
                const actions = await parse(fs.readFileSync(context.summon))
                pool.push({ actions, context })
            }
            if (childAction.children) {
                pool.push({ actions: childAction.children, context })
            }
        }
        pool.shift()
    }
    return pool
}

const runActions = (actions, context, executionContext) => new Promise((resolve) => {
    runActionsAndPropagate(actions, context, executionContext).then(resolve)
})

const parseAndRun = (filename) => {
    return parse(fs.readFileSync(filename)).then((actions) => runActions(actions, {}, { entrypointFilepath: filename }))
}

module.exports = { runActions, parseAndRun }