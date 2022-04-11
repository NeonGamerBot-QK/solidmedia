const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
id: { type: String },
email: { type: String, required: true },
  bio: { type: String, match: /[a-z]/ },
password: { type: String },
authToken: { type: String }, 
  createdAt: { type: Date, default: Date.now },
AccountLastUpdated: { type: Date, default: Date.now }
});
module.exports = mongoose.model("users", schema)
