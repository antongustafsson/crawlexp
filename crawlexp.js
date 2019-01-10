const fs = require('fs')
const parse = require('./parse')
const createActionDictionary = require('./actions')

const actionDictionary = createActionDictionary()

const runAction = (name, args, context) => {
    if (actionDictionary[name]) {
        return actionDictionary[name](context, args)
    } else {
        throw new Error(`No such action "${name}"`)
    }
}

const runActionsAndPropagate = async (actions, context) => {
    const runWithContext = (action, context) =>
        runAction(action.name, action.arguments, context)
    const pool = [
        { actions, context }
    ]
    while (pool.length > 0) {
        const currentActionsWithContext = pool[0]
        for (let i = 0; i < currentActionsWithContext.actions.length; i++) {
            const childAction = currentActionsWithContext.actions[i]
            const context = await runWithContext(childAction, currentActionsWithContext.context)
            if (childAction.children) {
                pool.push({ actions: childAction.children, context })
            }
        }
        pool.shift()
    }
    return pool
}

const runActions = (actions, context) => new Promise((resolve) => {
    runActionsAndPropagate(actions, context).then(resolve)
})

const parseAndRun = (filename) => {
    return parse(fs.readFileSync(filename)).then((actions) => runActions(actions, {}))
}

module.exports = { runActions, parseAndRun }