module.exports = (interface) => {
    return {
        'match-url': require('./actions/match-url'),
        'match-string': require('./actions/match-string'),
        'match-image-url': require('./actions/match-image-url'),
        'match-yt-watchurl': require('./actions/match-yt-watchurl'),
        'visit-url': require('./actions/visit-url'),
        'contains': require('./actions/contains'),
        'concat': require('./actions/concat'),
        'log': require('./actions/log'),
        'download-video': require('./actions/download-video'),
        'limit': require('./actions/limit'),
        'select': require('./actions/select'),
        'summon': require('./actions/summon'),
        'run-script': require('./actions/run-script'),
        'store-contents': require('./actions/store-contents'),
        'test': (context, arguments) => { // context: image
            return new Promise((resolve, reject) => {
                resolve(context)
            })
        },
        'store': (context, arguments) => { // context: image
            return new Promise((resolve, reject) => {
                resolve(context)
            })
        },
        'recycle': (context, arguments) => { // context: image
            return new Promise((resolve, reject) => {
                resolve(context)
            })
        },
    }
}