const mongoose = require("mongoose");
const schema = new mongoose.Schema({
description: { type: String  },
author: { type: Object },
  createdAt: { type: Date, default: Date.now },
LastUpdated: { type: Date, default: Date.now }
})
module.exports = mongoose.model("posts",schema)