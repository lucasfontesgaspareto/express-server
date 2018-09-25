// native nodejs
import path from 'path'
import fs from 'fs'

// 3rd party
import dotenv from 'dotenv'
import express from 'express'
import notifier from 'node-notifier'
import mongoose from 'mongoose'

// express middleware
import bodyParser from 'body-parser'
import compression from 'compression'
import responseTime from 'response-time'
import timeout from 'connect-timeout'
import helmet from 'helmet'
import cors from 'cors'
import methodOverride from 'method-override'
import session from 'express-session'
import ExpressBrute from 'express-brute'
import ExpressBruteMongoose from 'express-brute-mongoose'
import expressBruteSchema from 'express-brute-mongoose/dist/schema'
import morgan from 'morgan'
import errorHandler from 'errorhandler'

// owner middlewares
import routesV1 from './routes/v1'

// load database
mongoose.connect('mongodb://localhost/express', { useNewUrlParser: true })
mongoose.connection.once('open', () => console.log('database done!'))
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

dotenv.config()
const app = express()

// overwrite for development mode withou brute force!
let expressBruteForce = {
  prevent: (req, res, next) => next()
}

// session basic settings
const configSession = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}

if (process.env.NODE_ENV === 'production') {
  // brutal force prevention
  const expressBruteModel = mongoose.model('bruteforce', new mongoose.Schema({
    data: {
      count: Number,
      lastRequest: Date,
      firstRequest: Date
    },
    expires: {
      type: Date,
      index: {
        expires: '1d'
      }
    }
  }))
  const expressBruteStore = new ExpressBruteMongoose(expressBruteModel)
  expressBruteForce = new ExpressBrute(expressBruteStore)

  // session security settings
  app.set('trust proxy', 1)
  configSession.cookie.secure = true
}

// 3rd party middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(compression())

app.use(responseTime())

app.use(timeout('5s'))

app.use(helmet())

app.use(cors())

// override with different headers last one takes precedence
app.use(methodOverride('X-HTTP-Method')) // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) // IBM

app.use(session(configSession))

app.disable('x-powered-by')

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, '../log/http.log'), { flags: 'a' })
}))

// load routes registred in routes file
app.use('/api/v1/', routesV1)

// auth test bruteforce
app.get('/auth', expressBruteForce.prevent, (req, res, next) => {
  res.status(200).json({ success: true })
})

// error simulator
app.get('/error', (req, res, next) => {
  next(new Error('unknowError'))
})

// server-sent event stream
app.get('/events', function (req, res) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')

  // send a ping approx every 2 seconds
  var timer = setInterval(function () {
    res.write('data: ping\n\n')

    // !!! this is the important part
    res.flush()
  }, 2000)

  res.on('close', function () {
    clearInterval(timer)
  })
})

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({
    log: (error, message, req) => {
      notifier.notify({
        title: `Error in ${req.method} ${req.url}`,
        message
      })
    }
  }))
}

app.listen(3000, '0.0.0.0')