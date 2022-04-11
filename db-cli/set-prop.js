const mongoose = require('mongoose');
const users = require('../models/user')
var connected = false;
mongoose.connect(process.env.MONGOOSE).then(() => {
connected = true;
console.debug("Connected to mongooseDB")
console.log("\n")
const argv = process.argv.slice(2)
const id = argv[0]
const prop = argv[1]
let value = argv[2]
let encoding = argv[3] || "string"

if(!id || !prop || !value) {
console.log("Missing one of the following, id, prop, value")
process.exit(1)
}
let res = {
$set: {
accountLastUpdated: new Date()
}
};
console.log("unencoded", value)
if(encoding === "json") value = JSON.parse(value)
res.$set[prop] = value;
users.findOneAndUpdate({ _id: id }, res).then((user) => {
console.log(`Set ${prop} = `, value, "\n Exiting\n", user)
mongoose.connection.close()
});
})