var messageHideTimeout = null
const messageHideTime = 3000 // milliseconds

function checkSummonerName()
{
	let contents =
	{
		summonerName: document.getElementById('summonerName').value,
		region: document.getElementById('region').value
	}

	if(contents.summonerName == '')
		return // Empty name

	showMessage('Getting champions...')
	document.getElementById('btnCheckSummoner').disabled = true

	fetch('/summoner',
	{
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(contents)
	})
	.then((response) => response.json())
	.then((json) =>
	{
		if(json.message === 'Success')
			location.reload() // Reload page, express session now contains summoner data
		else
		{
			showMessage(json.message)
			document.getElementById('btnCheckSummoner').disabled = false
		}
	})
	.catch(err => console.error(err))
}

function showMessage(msg)
{
	console.log(`Showing message '${msg}'`)
	clearTimeout(messageHideTimeout)

	let element = document.getElementById('message')
	element.innerHTML = msg

	element.classList.remove('hidden')
	element.classList.add('shown')

	messageHideTimeout = setTimeout(() =>
	{
		element.classList.add('hidden')
		element.classList.remove('shown')
	}, messageHideTime)
}

window.onload = (event) =>
{
	// Set input box as focus when DOM is loaded
	document.getElementById('summonerName').focus()

	// Check summoner name if enter key is pressed while input is focused
	document.getElementById('summonerName').addEventListener('keypress', (event) =>
	{
		// If the user presses the "Enter" key on the keyboard
		if (event.key === 'Enter')
			checkSummonerName()
	})
}
