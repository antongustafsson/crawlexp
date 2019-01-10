module.exports = (context, arguments) => {
    console.log(context, arguments)
    return new Promise((resolve, reject) => {
        resolve(context)
    })
}