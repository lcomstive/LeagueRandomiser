const path = require('path')
const api = require('./api.js')

module.exports = (app) =>
{
	app.get('/', (req, res) =>
	{
		console.log(`Session ID: ${req.sessionID}`)
		if(!req.session.summoner)
			res.sendFile(path.join(__dirname, '/pages/summoner.html'))
		else
			res.sendFile(path.join(__dirname, '/pages/randomiser.html'))
	})

	app.post('/clearSession', (req, res) =>
	{
		req.session.destroy()
		console.log('Cleared session')
	})

	app.post('/summoner', (req, res) =>
	{
		let summonerName = req.body.summonerName
		let region = req.body.region
		console.log(`Checking summoner ${summonerName} [${region}]`)

		// Get summoner info
		api.summoner.getBySummonerName({ region, summonerName })
		.then((summoner) =>
		{
			req.session.region = region
			req.session.summoner = summoner

			// Get all champions with mastery points
			api.championMastery.getAllChampions({
				region: req.session.region,
				summonerId: req.session.summoner.id
			})
			.then((champions) =>
			{
				req.session.champions = []
				champions.forEach(champ => req.session.champions.push(champ.championId))
			})
			.then(() =>
			{
				// Relay success to client
				console.log('Success!')
				res.json({ message: 'Success' })
			})
		})
		.catch((err) =>
		{
			console.log('Not found')
			console.error(err)
			res.json({ message: 'Not found' })
		})
	})

	app.get('/summoner', (req, res) =>
	{
		if(req.session.summoner)
			res.json(req.session.summoner)
		else
			res.json({ message: 'No session found'})
	})

	app.get('/champions', (req, res) =>
	{
		if(req.session.summoner)
			res.json({ champions: req.session.champions })
		else
			res.json({ champions: [] })
	})

	app.get('/champions/:championID', (req, res) => res.json(api.championMap.get(req.params.championID)))

	app.get('/runes', (req, res) => res.json(api.runeMap))
}
