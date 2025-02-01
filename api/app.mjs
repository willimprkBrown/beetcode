import './config.mjs'
import './db.mjs'
import express from 'express'
import url from 'url'
import cors from 'cors'
import path from 'path'
import session from 'express-session'
import rateLimit from 'express-rate-limit';
import passport from 'passport'
import mongoose from 'mongoose'
import axios from 'axios'

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

const executeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many code executions from this IP, please try again after 15 minutes'
});

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

app.post('/execute', executeLimiter, async (req, res) => {
    try {
        const { code, language } = req.body;
        
        // Validate input
        if (!code || !language) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Map languages to specific versions
        const versionMap = {
            python: '3.10.0',
            cpp: '10.2.0',
            javascript: '18.15.0',
            java: '15.0.2',
            csharp: '6.12.0'
        };

        const version = versionMap[language];
        if (!version) {
            return res.status(400).json({ error: "Unsupported language" });
        }

        // Basic code sanitization
        const sanitizedCode = code.replace(/fs\.|child_process|execSync|spawnSync/gi, '');

        // PistonAPI configuration
        const pistonResponse = await axios.post(
            'https://emkc.org/api/v2/piston/execute',
            {
                language: language,
                version: version,
                files: [{ content: sanitizedCode }],
                args: [],
                stdin: ""
            },
            { timeout: 10000 }
        );

        // Format response
        const result = {
            output: pistonResponse.data.run.output,
            language: pistonResponse.data.language,
            executionTime: pistonResponse.data.run.time,
            memoryUsage: pistonResponse.data.run.memory,
            exitCode: pistonResponse.data.run.exitCode
        };

        res.json(result);

    } catch (error) {
        console.error("Execution error:", error);
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || "Code execution failed";
        
        res.status(statusCode).json({
            error: errorMessage,
            details: error.response?.data || error.message
        });
    }
});

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