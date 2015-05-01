let http = require('http')
let fs = require('fs')
let path = require('path')
let url = require('url')
let _ = require('lodash')
require('songbird')


http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let parsedUrl = url.parse(req.url)

    ls(parsedUrl.pathname)
        .then(files =>  {
            res.end(JSON.stringify(files))
        })
        .catch(e => console.log(e.stack))

}).listen(8080)


async function ls(dir){
    let promises = []
    let stat = await fs.promise.stat(dir)
    if(stat.isDirectory()) {
        for (let file of await fs.promise.readdir(dir)) {
            promises.push(await ls(path.join(dir, file)))
        }
        let results = await Promise.all(promises)
        return _.flatten(results)
    } else {
        return new Array(dir)
    }
}
