require('dotenv').config()
const express = require('express'),
  app = express(),
  server = require('http').Server(app),
  router = express.Router(),
  bodyParser = require('body-parser'),
  ejwt = require('express-jwt'),
  passport = require('passport'),
  cors = require('cors'),
  port = process.env.PORT || 8000,
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  session = require('express-session'),
  jsonwebtoken = require('jsonwebtoken')

app.use(haltOnTimedout)

function haltOnTimedout(req: { timedout: any }, res: any, next: () => void) {
  if (!req.timedout) next()
}
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Forwarded-For'],
    credentials: true,
  })
)

app.use(
  bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    type: 'application/x-www-form-urlencoded',
  })
)

app.use(
  bodyParser.json({
    limit: '500mb',
    type: 'application/*',
  })
)

// app.use(
//   ejwt({
//     secret: process.env.JWT_SECRET_KEY || 'supersecret',
//     algorithms: ['RS256'],
//   }).unless({
//     path: [
//       {
//         url: /\/auth*/,
//       },
//     ],
//   })
// )

passport.serializeUser(function (user: any, cb: (arg0: null, arg1: any) => void) {
  cb(null, user)
})

passport.deserializeUser(function (obj: any, cb: (arg0: null, arg1: any) => void) {
  cb(null, obj)
})
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla',
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(function (req: { query: { related: string } }, res: any, next: () => void) {
  if (req.query.related) {
    req.query.related = `[${req.query.related}]`
  }

  next()
})

function parseQueryString(
  req: { query: { hasOwnProperty: (arg0: string) => any; filter: any; filterRelated: any } },
  res: any,
  next: () => void
) {
  if (req.query && req.query.hasOwnProperty('filter')) {
    req.query.filter = _.mapValues(req.query.filter, function (value: string, key: any) {
      if (value === 'false') return false
      else if (value === 'true') return true
      else return value
    })
  }
  if (req.query && req.query.hasOwnProperty('filterRelated')) {
    req.query.filterRelated = _.mapValues(
      req.query.filterRelated,
      function (value: string, key: any) {
        if (value === 'false') return false
        else if (value === 'true') return true
        else return value
      }
    )
  }
  next()
}

fs.readdirSync('./app/routes').forEach((file: any) => {
  router.use(
    `/${path.parse(file).name}`,
    parseQueryString,
    require(`./app/routes/${file}`)(express.Router())
  )
})

app.use(router)

server.listen(port, () => {
  console.log(`Server active at http://localhost:${port} on ID: ${process.pid}`)
})
