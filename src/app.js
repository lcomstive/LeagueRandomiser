/// Imports ///
const fs = require('fs')
const https = require('https')
const Express = require('express')
const Session = require('express-session')

/// Config ///
let port = process.env.PORT || 4434
let sslKey = process.env.SSL_KEY
let sslCert = process.env.SSL_CERT

/// Application ///
const app = Express()
app.use(require('cors')())
app.use(Express.json())
app.use(require('body-parser').urlencoded({ extended: true }))

// Serve static content from local directory
app.use(Express.static('public'))

var sessionConfig = 
{
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESSION_SECRET,
	cookie: { maxAge: 8640000 /* One day, in milliseconds */ }
}
if(app.get('env') === 'production')
{
	app.set('trust proxy', 1) // Trust first proxy
	sessionConfig.cookie.secure = true // Serve secure cookies
}
app.use(Session(sessionConfig))

onServerStart = () =>
{
	console.log(`LeagueRandomiser listening on port ${port}`)
}

if(!sslKey || !sslCert)
	app.listen(port, onServerStart)
else
	https.createServer({
		key: fs.readFileSync(sslKey),
		cert: fs.readFileSync(sslCert)
	}, app).listen(port, onServerStart)

module.exports = app