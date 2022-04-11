const mongoose = require('mongoose');
const users = require('../models/user')
var connected = false;
mongoose.connect(process.env.MONGOOSE).then(() => {
connected = true;
console.debug("Connected to mongooseDB")
users.find().then((Users) => {
Users.forEach(u => {
console.log(`${u._id}`)
Object.entries(u._doc).forEach(([prop, val]) => {
console.log(`\t ${prop}: `, val)
})
console.log("\n\n")
})
mongoose.connection.close()
})
})