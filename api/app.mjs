// app.mjs

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
import { Server as SocketServer } from 'socket.io';
import http from 'http';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()
const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Enable CORS credentials (cookies, authorization headers)
  }));

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

const rooms = []

// WebSocket (Socket.IO) setup
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (user) => {
        
        if (rooms.length == 0) {
            rooms.push(user)
            socket.join(user)
        } else if (rooms.includes(user)) {
            socket.join(user)
        } else {
            const opp = rooms.pop()
            socket.join(opp)
            socket.nsp.to(opp).emit('joined', { roomid: opp });
        }
    });

    socket.on('leaveroom', ({ user }) => {
        let index = rooms.indexOf(user)
        console.log(rooms)
        if (index > -1) {
            rooms.splice(index, 1)
        }
        console.log(rooms)
    })

    socket.on('flip', ({ roomId }) => {
        socket.to(roomId).emit('flipped');
    });

    socket.on('disrupt', ({ roomId }) => {
        socket.to(roomId).emit('disrupted')
    })

    socket.on('hallucinate', ({ roomId }) => {
        socket.to(roomId).emit('hallucinating')
    })

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Existing endpoint for code execution
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

// Existing endpoints for login and register
app.post('/login', passport.authenticate('local', {keepSessionInfo: true}), function(req, res) {
    console.log("Login")
    const user = req.session.passport.user
    console.log(user)
    req.logIn(user, function (err) {
        return res.json({ user });
     });
});

app.post('/register', function (req, res, next) {
    User.register({ username: req.body.username, active: false }, req.body.password, (err) => {
        if (err) {
            return res.json({ status: false });
        }
        return res.json({ status: true });
    });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
