# League Randomiser
Generates a random champion and runes for a player to try out, this is intended for fun or a challenge.

## Why?
A good reason to learn using NodeJS and a REST API.

## Technology
Running [NodeJS](https://nodejs.org/en) and [express](https://expressjs.com/) to serve web content.
The official [Riot API](https://developer.riotgames.com/apis) is used via [fightmegg's library](https://github.com/fightmegg/riot-api).

## Setup
 - Install [NodeJS](https://nodejs.org/en)
 - Clone the repo
 - Open a terminal and cd to the root repo directory
 - Create a file called `.env`, or create environment variables described below:
	- `RIOT_KEY` - An API key from [Riot's developer portal](https://developer.riotgames.com/)
	- `PORT` - Port for application to bind to
	- `SESSION_SECRET` - Used for cookie secrets. Recommended to randomly generate an alphanumeric string 15-20 characters long
	- `SSL_KEY`, `SSL_CERT` - Required for enabling SSL/HTTPS. Values are absolute paths to key and certificate, respectively
	- `PRODUCTION` - If exists, application is run in production mode. This is mainly used for allowing reverse proxies and enabling secure cookies.
 - Run `node src/index.js`

## License
This repository is released under the [ISC License](./LICENSE.md)
