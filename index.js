const express = require('express')
const app = express()
var csso = require("csso")
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path');
const fs = require('fs')
const methodOverride = require('method-override')

//const db = require('quick.db')
const cors = require('cors')
const mongoose = require('mongoose');
const users = require('./models/user')
var connected = false;
mongoose.connect(process.env.MONGOOSE).then(() => {
connected = true;
console.debug("Connected to mongooseDB")
})
const compression = require('compression');
app.use(compression());


// app.use((req,res,next) => {
// if(!fs.existsSync(path.join(__dirname, 'public', req.url))) return next()
// if(['.js'].some(e => req.url.endsWith(e))) {
// const stream = require('child_process').exec("npx browserify public/"+req.url);
// stream.stdout.pipe(res);
// }
// else if(req.url.endsWith('.css')) {
// res.end(csso.minify(fs.readFileSync(path.join(__dirname, 'public', req.url)).toString()).css)
// }
//  else {
// next()
// }
// })
app.use(express.static('dist'))
app.use("/images/", express.static('public/images'))
app.set('view-engine', 'ejs')
app.use(flash())
app.use(cors())
app.use(session({
  secret: 'jso-n',
  resave: false,
  saveUninitialized: false
}))

//app.use(passport.initialize())
//app.use(passport.session())
app.use(methodOverride('_method'))

app.use((req,res,next) => {
if(req.session.user) req.user = req.session.user;
next()
})
app.use((req,res,next) => {
if(!connected) return res.status(503).send("503: DB not connected")

next()
})
// app.use('/cdn', require('./cdn'))
app.use('/api', require('./api'))
app.use(express.urlencoded({ extended: false }))
app.get('/test-index', (req,res) => {
res.render('index-c.ejs')
})
app.get('/test-login', (req,res) => {
res.render('login-c.ejs')
})

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', {})
 
})
var randomHex = require('random-hex');

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})
// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }))
app.post('/users', (req,res) => res.send(users))
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs', { req: req})
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    if(await users.findOne({ email: req.body.email })) return res.redirect('/register?error=email%20registered%20try%20logging%20in%20as%20' + req.body.email) 
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const id = Buffer.from(Date.now().toString()).toString('base64')
    // db.set('user_' + req.body.email, {
    //   id: id,
    //   name: req.body.name,
    //   email: req.body.email, //i cant login..
    //   password: hashedPassword,
    //   type: 'email+local'
    // })
   const obj = {
      id: id,
      name: req.body.name,
      email: req.body.email, //i cant login..
      password: hashedPassword,
authToken: Buffer.from(new Date().toDateString()).toString('base64') + (await bcrypt.hash(req.body.password,  20)),
    //  type: 'id+local'
    }
res.redirect('/login')
new users(obj).save()
 
  } catch (e) {
    res.redirect('/register')
    console.log(e)
  }
})

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
app.post('/login', async (req,res) => {
const { email, password } = req.body;
const user = await users.findOne({ email })
if(user) {
const passwordCorrect = await bcrypt.compare(password, user.password)
if(passwordCorrect) {
req.session.user = user;
res.redirect('/');
} else {
res.redirect('/login?type=password?error=' + encodeURIComponent("Password Incorrect"))
}
} else {
res.redirect('/login?type=email&error=' + encodeURIComponent("no account with email: " + email))
}
})
function checkAuthenticated(req, res, next) {
  if (req.user) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.user) {
    return res.redirect('/')
  }
  next()
}
const http = require('http').Server(app);
const io = require('socket.io')(http);
// app.listen(3000)
http.listen(3000)
app.get('/calc', (req, res) => {
  res.sendFile(__dirname + '/calculater/calc.html')
});
io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

app.use('*', (req,res) => {
    const fs = require('fs')
    res.status(404).sendfile('./views/404.html')
})
