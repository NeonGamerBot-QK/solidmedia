const fs = require('fs')
let defaultOps = {
  path: "./database.json"
}
class logger {
    constructor(ops = defaultOps) {
        this.path = ops.path || 'logger.diff'
        this.cache = this._getlogs()
    }
_getlogs() {
    const data = fs.readFileSync(this.path);
    return data;
}
log(data) {
    try {
 fs.appendFileSync(this.path, '\n' + data)
    } catch (e) {
        return console.error(e)
    }
    
}
}
module.exports = logger; /*{
    note,
    warn,
    log,
    clear,
    create
}
*/