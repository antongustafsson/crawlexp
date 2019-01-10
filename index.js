const { parseAndRun } = require('./crawlexp')

parseAndRun('./index.xml').then(() => {
    console.log('Nothing left to do')
})