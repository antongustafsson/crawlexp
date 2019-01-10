const htmlparser = require("htmlparser2");

module.exports = (xmlContent) => new Promise((resolve) => {
    const refs = []
    const actions = []
    const addChild = (ref, child, root) => {
        if (root) {
            actions.push(child)
        } else {
            if (!ref.children) {
                ref.children = []
            }
            ref.children.push(child)
        }
    }

    const setText = (ref, text) => {
        if (ref) {
            ref.text = text
        }
    }

    const parser = new htmlparser.Parser({
        onopentag: (name, attributes) => {
            addChild(refs[refs.length - 1], { name, arguments: attributes }, refs.length < 1)
            const referenceChildren = refs.length < 1 ? actions : refs[refs.length - 1].children
            refs.push(referenceChildren[referenceChildren.length - 1])
        },
        ontext: (text) => {
            setText(refs[refs.length - 1], text)
        },
        onclosetag: (name) => {
            refs.pop()
        },
        onend: () => {
            resolve(actions)
        }
    })

    parser.write(xmlContent)
    parser.end()
})