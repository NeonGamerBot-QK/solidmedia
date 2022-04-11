const express = require("express");
const Post = require('./models/post');
const Users = require('./models/user');
function cleanuser(u) {
//console.log([u], "user")
if(u) u.password = undefined;
if(u) u.authToken = undefined;
return u;
}
const router = express.Router();
// router.use((req,res,next) => {
// if(req.body && req.body.json) req.body.json = JSON.parse(req.body.json);
// if(req.body && req.body.json && Object.keys(req.body).length === 1) req.body = req.body.json;
// console.log("pre", req.body)
// next()
// })
router.use(express.json())
router.get('/users/:id', async (req,res) => {
const query = req.params.id
if(req.user) {
const user = cleanuser(await Users.findOne({ _id: query }))
res.json(user)
} else {
if(req.headers["authorization"]) {
const auth = req.headers["authorization"];
const authUser = await Users.findOne({ authToken: auth });

if(authUser) {
res.json(cleanuser(await Users.findOne({ _id: query })))
} else {
res.status(401).end()
}
} else {
res.status(403).end()
}
}
})
router.get('/user', (req,res) => {
res.json(req.user)
})
router.post('/posts/create', async (req,res) => {
console.log(req.body)
if(req.user) {
console.debug('Createing post')
const post = await new Post({
description: req.body.description,
author: req.user
}).save();
console.debug('Created post')
res.status(201).json({ message: "posted", ...post })

} else {
res.status(403).end()
}
});
router.get('/posts/homepage', async (req,res) => {
if(req.user) {
let posts = await Post.find()
//console.log(users, users.length)
posts = posts.filter(p => p.author._id === req.user._id || (req.user.followers && req.user.followers.includes(p.author._id)));
//users = users.pop()
const users = await Promise.all(posts.map((p) => Users.findOne({ email: p.author.email })))
//console.log([users], "users:array")
posts = posts.map((p) => {
const u = users.find((u) => u._id.toString() === p.author._id);
//console.log([u], "user:map")
p.author = cleanuser(u);
return p;
});
posts.sort((a, b) => a.LastUpdated - b.LastUpdated)
//console.clear();
//console.log("done", posts)
res.json(posts)
} else {
res.status(403).end()
}
})
router.delete('/posts/:id/delete', (req,res) => {
if(req.user) {
const postId = req.params.id;
Post.findOne({ _id: postId }).then((r) => {
r.remove();
res.status(204).end()
})
} else {
res.status(403).end()
}
})
router.patch('/posts/:id/edit', (req,res) => {
const body = req.body;
if(req.user) {
Post.findOneAndUpdate({ _id: req.params.id }, body).then(() => {
res.status(200).end()
})
} else {
res.status(403).end()
}
})
module.exports = router;