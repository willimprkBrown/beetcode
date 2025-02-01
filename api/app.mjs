import './config.mjs'
import './db.mjs'
import express from 'express'
import url from 'url'
import cors from 'cors'
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()

app.use(cors(
    {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, 
        allowedHeaders: ['Origin', "X-Requested-With", "Content-Type", "Accept"],
        "preflightContinue": false,
        "optionsSuccessStatus": 200
    }
));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

const User = mongoose.model('User')
const Stats = mongoose.model('Stats')
const Problems = mongoose.model('Problems')

app.set('trust proxy', 1)

app.use(session({
    secret: "BAERBALEJOEIFJOSIEJF",
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        secure: false, 
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000), 
        httpOnly: false, 
        // SameSite: "none"
    }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.post('/login', passport.authenticate('local', {keepSessionInfo: true}), function(req, res) {
    console.log("Login")
    const user = req.session.passport.user
    console.log(user)
    req.logIn(user, function (err) { // <-- Log user in
        return res.json({ user })
     });
    // res.json({ user: req.session.passport.user })
});

app.post('/register', function (req, res, next) {
    User.register({ username: req.body.username, active: false }, req.body.password, (err) => {
        if (err) {
            return res.json({ status: false })
        }
        return res.json({ status: true })
    })
})

const port = process.env.PORT || 3001
app.listen(port, () => {console.log(`Server is listening on ${port}`)})