var runes = []
var summoner = {}
var champions = []
var isLoaded = false

const StatMods =
{
	"Adaptive Force": "perk-images/StatMods/StatModsAdaptiveForceIcon.png",
	"Armor": "perk-images/StatMods/StatModsArmorIcon.png",
	"Attack Speed": "perk-images/StatMods/StatModsAttackSpeedIcon.png",
	"Ability Haste": "perk-images/StatMods/StatModsCDRScalingIcon.png",
	"Health Scaling": "perk-images/StatMods/StatModsHealthScalingIcon.png",
	"Magic Resist": "perk-images/StatMods/StatModsMagicResIcon.MagicResist_Fix.png"
}
const StatModSlots = [
	[ StatMods["Adaptive Force"], StatMods["Attack Speed"], StatMods["Ability Haste"] ],
	[ StatMods["Adaptive Force"], StatMods["Armor"], StatMods["Magic Resist"] ],
	[ StatMods["Health Scaling"], StatMods["Armor"], StatMods["Magic Resist"] ]
]

var randomData = { championID: -1 }

clearSession = () => fetch('/clearSession', { method: 'POST' }).then(location.reload())

getChampions = () => fetch('/champions', { method: 'GET' })
						.then(response => response.json())
						.then(body => champions = body.champions)
						.then(() => console.log(champions))

getRunes = () => fetch('/runes', { method: 'GET' })
					.then(response => response.json())
					.then(body =>
					{
						runes = body

						runes[0].colour = '#ce4142'; // Domination
						runes[1].colour = '#42aab5'; // Inspiration
						runes[2].colour = '#c9ae78'; // Precision
						runes[3].colour = '#9cd784'; // Resolve
						runes[4].colour = '#8c98ea'; // Sorcery
					})
					.then(() => console.log(runes))

setIsLoaded = (loaded) =>
{
	isLoaded = loaded

	document.getElementById('loading').style.display = loaded ? 'none' : 'block'
	document.getElementById('content').style.display = loaded ? 'block' : 'none'
}

setRunes = (parentElement, rune) =>
{
	parentElement.children[0].src = '/img/' + rune.icon
	parentElement.children[0].title = rune.name

	// Set icons for rune slots
	for(let i = 0; i < rune.selectedSlots.length; i++)
	{
		parentElement.children[i + 1].src = '/img/' + rune.selectedSlots[i].icon
		parentElement.children[i + 1].title = rune.selectedSlots[i].name
	}
		
	// Set outer circle colour
	let runeBackground = parentElement.getElementsByClassName('runeBackground')[0]
	runeBackground.style.color = rune.colour
}

randomise = () =>
{
	randomData = {}
	
	// Choose random champion
	randomData.championID = champions[Math.floor(Math.random() * champions.length)]

	fetch(`/champions/${randomData.championID}`, { method: 'GET' })
		.then(response => response.json())
		.then(body =>
		{
			randomData.champion = body
			document.getElementById('championName').innerHTML = body.name
			
			let summonerURI = body.id.replace('\'', '').replace(' ', '')
			document.getElementById('championIcon').src = `https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${summonerURI}.png`
		})

	// Choose random runes
	randomData.runes = [
		/* primary 	 */ runes[Math.floor(Math.random() * runes.length)],
		/* secondary */ runes[Math.floor(Math.random() * runes.length)]
	]

	while(randomData.runes[0] == randomData.runes[1])
		randomData.runes[1] = runes[Math.floor(Math.random() * runes.length)]

	// Primary runes
	randomData.runes[0].selectedSlots = []
	let slots = randomData.runes[0].slots
	for(let i = 0; i < 4; i++)
		randomData.runes[0].selectedSlots.push(slots[i].runes[Math.floor(Math.random() * slots[i].runes.length)])

	let runeRoot = document.getElementById('primaryRunes')

	setRunes(document.getElementById('primaryRunes'), randomData.runes[0])

	// Secondary runes
	randomData.runes[1].selectedSlots = []
	slots = randomData.runes[1].slots
	for(let i = 0; i < 2; i++)
		randomData.runes[1].selectedSlots.push(slots[i].runes[Math.floor(Math.random() * slots[i].runes.length)])

	runeRoot = document.getElementById('secondaryRunes')

	setRunes(document.getElementById('secondaryRunes'), randomData.runes[1])

	// Stat Mods
	let statModRoot = document.getElementById('statMods')
	for(let i = 0; i < 3; i++)
		statModRoot.children[i].src = '/img/' + StatModSlots[i][Math.floor(Math.random() * StatModSlots[i].length)]
}

// When page loads
window.onload = (event) =>
{
	setIsLoaded(false)

	// Get summoner data
	fetch('/summoner', { method: 'GET' })
		.then(response => response.json())
		.then(body =>
		{
			if(body.message)
			{
				console.error(body.message)
				return;
			}

			console.log(body)
			summoner = body

			let summonerName = document.getElementById('summonerName')
			summonerName.innerHTML = body.name
			summonerName.href = 'https://www.op.gg/summoners/oce/' + body.name
			document.getElementById('summonerIcon').src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${body.profileIconId}.png`

		})
		.then(() => getChampions())
		.then(() => getRunes())
		.then(() => randomise())
		.then(() => setIsLoaded(true))

	// Check summoner name if enter key is pressed while input is focused
	document.body.onkeyup = (event) =>
	{
		// If the user presses the "Space" key on the keyboard, re-roll
		if (event.key == ' ' || event.code == 'Space')
			randomise()
	}
}