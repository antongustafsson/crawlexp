const youtubedl = require('youtube-dl');
const fs = require('fs')
const path = require('path')
const filesize = require('filesize')

module.exports = (context, arguments) => new Promise((resolve, reject) => {
    if (context.type === 'strings') {
        const downloadPath = path.resolve(path.parse(process.mainModule.filename).dir, 'files')
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath)
        }
        const { url } = arguments
        const urls = context.contents || []
        if (url) urls.unshift(url)

        const promises = []
        for (let i = 0; i < urls.length; i++) {
            const promise = new Promise((resolve, reject) => {
                const filename = `temp${Math.round((Math.random() * Number.MAX_SAFE_INTEGER)).toString(36)}.mp4`
                let informedFilename = null
                const videoUrl = urls[i]
                const video = youtubedl(videoUrl,
                    // Optional arguments passed to youtube-dl.
                    ['--format=18'],
                    // Additional options can be given for calling `child_process.execFile()`.
                    { cwd: downloadPath });

                // Will be called when the download starts.
                video.on('info', function (info) {
                    process.stdout.write(`\nDownloading video\n   Filename: ${info._filename}\n   Size: ${filesize(info.size)}\n`)
                    informedFilename = info._filename
                });
                const initialWritePath = path.resolve(downloadPath, filename)
                video.pipe(fs.createWriteStream(initialWritePath));
                video.on('end', () => {
                    if (informedFilename) {
                        fs.renameSync(initialWritePath, path.resolve(downloadPath, informedFilename))
                    }
                    resolve()
                })
                video.on('error', reject)
            })
            promises.push(promise)
        }
        Promise.all(promises).then(() => resolve({ type: 'empty' }))
    }
})