try {
console.log(`${new Array(20).join('=')}BUILD START${new Array(20).join('=')}`)
var UglifyJS = require("uglify-js");
var csso = require("csso")
var browserify = require('browserify');
var fs = require('fs')
const path = require('path')
const files = fs.readdirSync('public').filter(f => ['.js', '.css', '.json', '.html'].some((e) => f.endsWith(e)) || fs.statSync(path.join(__dirname, "public", f)).isDirectory())
if(fs.existsSync('dist')) fs.rmSync('dist', { recursive: true }, (err) => {
if(err) console.error(err.message)
else console.log("rm dist")
})
fs.mkdirSync('dist', { recursive: true })
files.forEach((f) => {
const p = path.join("public", f)
if(['.js', '.css', '.html'].some((e) => f.endsWith(e))) {
const contents = fs.readFileSync(p)

const dest = path.join("dist", f.split('.').join('.min.'))
console.log("DEST", dest)
let usejs = f.endsWith('.js');
if(f.endsWith('.js')){
    try {
        
console.log('npx browserify \"' + p + '"\"')
const js = /* browserify().require(require.resolve(`./${p}`), { 
    entry: true,
    debug: true
}).bundle().on('error', console.error).pipe(fs.createWriteStream(dest))  */ require('child_process').spawnSync(path.join(__dirname, 'node_modules', '.bin', 'browserify'), [`"${p}"`], { shell: true }).toString();
console.log("JS", js)
fs.writeFileSync(dest, js)
    } catch (e) {
        console.error(e.message);
    }
} 
let choice;
if(usejs) choice = dest;
if(!usejs) choice = p
let source = require('child_process').execSync('npx minify ' + choice)

let sourceMap = `\n//#SourceMapUrl data:text/plain;base64,${source.toString('base64')}`
if(f.endsWith('html') || f.endsWith('.css')) sourceMap = "\n"
fs.writeFileSync(dest, source.toString() + sourceMap, { recursive: true })
} else if(f.endsWith('.json')) {
const contents = fs.readFileSync(p)

const dest = path.join(__dirname, "dist", f.split('.').join('.min.'))
fs.writeFileSync(dest, JSON.stringify(JSON.parse(contents)), { recursive: true })
} else if  (fs.statSync(path.join(__dirname, "public", f)).isDirectory()) {
fs.readdirSync(path.join(__dirname, "public", f)).forEach(add(path.join(__dirname, "public", f), path.join(__dirname, "dist", f)))
}
})
function add(parent, out ) {
fs.mkdirSync(out, { recursive: true })
return function (f) {
// if(!['.js', '.css', '.json', '.html'].some((e) => f.endsWith(e))) return;
const p = path.join(parent, f)
const contents = fs.readFileSync(p)
console.log(p)
if(!['.js', '.css', '.html', '.json'].some((e) => f.endsWith(e)) && !fs.statSync(p).isDirectory()) {
fs.writeFileSync(path.join(out, f), contents)
}
if(['.js', '.css', '.html'].some((e) => f.endsWith(e))) {
const dest = path.join(out, f.split('.').join('.min.'))
let usejs = f.endsWith('.js');
var js;
if(f.endsWith('.js')){
 js = require('child_process').spawnSync(path.join('node_modules', '.bin', 'browserify'), [`"${p}"`], { shell: true }).output[1].toString();
// console.log("js", js.length, dest)
// console.log(dest, js.length)
fs.writeFileSync(dest, js, (err) => {
    console.log("WRITTEN", err)
})
} 
let choice;
if(usejs) choice = fs.readFileSync(dest);
if(!usejs) choice = contents
 let source = /* "(function() {"+*/Buffer.from(UglifyJS.minify(choice.toString()).code || fixme(choice.toString()))//require('child_process').execSync('npx minify ' + choice)
// if(!usejs) source.slice("(function() {".length)
// if(usejs) source += "})()"
function fixme(d) {
if(dest.endsWith(".css")) {
return csso.minify(d).css;
}
}
let sourceMap = `\n//#SourceMapUrl data:text/plain;base64,${source.toString('base64')}`
if(f.endsWith('.html') || f.endsWith('.css')) sourceMap = "\n"
fs.writeFileSync(dest, source.toString() + sourceMap, { recursive: true })
} else if(f.endsWith('.json')) {
const dest = path.join(out, f.split('.').join('.min.'))
fs.writeFileSync(dest, JSON.stringify(JSON.parse(contents)), { recursive: true })
} else if  (fs.statSync(path.join(parent, f)).isDirectory()) {
fs.readdirSync(path.join(parent, f)).forEach(add(path.join(parent, f), path.join(out, f)))
}
}
}
process.on('beforeExit', () => {

console.log(`${new Array(20).join('=')}BUILD END${new Array(20).join('=')}`)

})
process.on('uncaughtException', (e) => {
console.error(e.message)
})
} catch (e) {
    console.error(e.message);
}