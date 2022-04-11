const user = require("./models/user.js")
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE).then(() => {
user.find().then((u) => {
	console.log(u);
	u.forEach((m) => {
		if(m.email === "connortlin@gmail.com") m.remove()
	})
	process.exit()
})
console.debug("Connected to mongooseDB")

})
//ee