import mongoose from 'mongoose'
import passport from 'passport'
import passportLocalMongoose from 'passport-local-mongoose'

mongoose.connect(process.env.DSN)

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
})

const statsSchema = new mongoose.Schema({
    wins: { type: Number },
    losses: { type: Number },
    language: { type: String }
})

const problemSchema = new mongoose.Schema({
    statement: { type: String }, 
    test_cases: { type: Object }
})

userSchema.plugin(passportLocalMongoose)

mongoose.model('User', userSchema)
mongoose.model('Stats', statsSchema)
mongoose.model('Problems', problemSchema)