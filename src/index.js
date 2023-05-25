require('dotenv').config() // Read .env file into `process.env`

const app = require('./app.js')
require('./routes.js')(app)
