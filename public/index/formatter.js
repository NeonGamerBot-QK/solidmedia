window.Formatter = class Formatter {
findhash (text) {
if(text.indexOf('#') === -1) return text;
let splits = text.split('#').map((split, index) => {
if(!index % 2 === 0) {
return "#"+split.split(' ')[0];
}
}).filter(Boolean);
return splits
}
findMentions(text) {
if(text.indexOf('@') === -1) return text;
let splits = text.split('@').map((split, index) => {
if(!index % 2 === 0) {
return "@"+split.split(' ')[0];
}
}).filter(Boolean);
return splits
}
 getHTML(text) {
let mentions = this.findMentions(text);
let hashes = this.findhash(text);
let res = new String(text)
if(!Array.isArray(hashes) && !Array.isArray(mentions)) return text;
if(Array.isArray(hashes)) hashes.forEach((hash) => {
res = res.replace(hash, `<a href="${hash}">${hash}</a>`);
})
if(Array.isArray(mentions)) mentions.forEach((men) => {
res = res.replace(men, `<span>${men}</span>`)
})
return res;
}
}