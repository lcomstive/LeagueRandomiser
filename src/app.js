/// Imports ///
const Express = require('express')
const Session = require('express-session')

/// Config ///
let port = process.env.PORT || 4434

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

app.listen(port, () =>
{
	console.log(`LeagueRandomiser listening on port ${port}`)
})

module.exports = app