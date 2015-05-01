let http = require('http')
let fs = require('fs')
let path = require('path')
let url = require('url')
let _ = require('lodash')
require('songbird')

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')

    ls(url.parse(req.url).pathname)
    .then(files => res.end(JSON.stringify(files)))
    .catch(e => console.log(e.stack))

}).listen(8080, () => console.log('Server listening at http://127.0.0.1:8080'));

async function ls(dir){
    let promises = []

    if(await isDirectory(dir)) {
        for (let file of await fs.promise.readdir(dir)) {
            promises.push(ls(path.join(dir, file)))
        }
        let results = await* promises
        return _.flatten(results)
    } else {
        return [dir]
    }
}

async function isDirectory(dir) {
    return (await fs.promise.stat(dir)).isDirectory()
}
