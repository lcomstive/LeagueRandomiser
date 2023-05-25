const { RiotAPI, RiotAPITypes } = require('@fightmegg/riot-api')

const apiConfig = 
{
	debug: false,
	cache:
	{
		cacheType: 'local',
		ttls: { byMethod: { [RiotAPITypes.METHOD_KEY.SUMMONER.GET_BY_SUMMONER_NAME]: 5000 /* ms */ } }
	}
}
var api = new RiotAPI(process.env.RIOT_KEY, apiConfig)

// Get all champions and store them in a hashmap with key champion ID, value champion data
api.championMap = new Map()
api.ddragon.champion.all()
	.then(champions =>
	{
		for(const [key, value] of Object.entries(champions.data))
			api.championMap.set(value.key, value)
	})
	// .then(() => console.log(api.championMap))
	.then(() => console.log(`Cached ${api.championMap.size} champions`))


api.ddragon.runesReforged().then(result => api.runeMap = result)

module.exports = api