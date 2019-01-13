const { parseAndRun } = require('./crawlexp')
const path = require('path')

parseAndRun(path.resolve(process.argv[2] || '.')).then(() => {
    console.log('Nothing left to do')
})