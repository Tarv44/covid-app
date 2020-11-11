const url = 'https://covid-19-statistics.p.rapidapi.com/reports?iso=USA'

const jonahsPicks = ['California', 'Oregon', 'Washington', 'Louisiana', 'Illinois', 'Ohio', 'Utah', 'New York'];


function generateNumCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function filterHotSpots(counties) {
	const newCaseTotals = counties.map(county => county.confirmed_diff)
	let top3 = [];
	while (top3.length < 3) {
		let max = newCaseTotals[0];
		let maxIndex = 0;
		for(let i = 0; i < newCaseTotals.length; i++) {
			if (newCaseTotals[i] > max) {
				max = newCaseTotals[i];
				maxIndex = i;
			}
		}
		top3.push(max)
		newCaseTotals.splice(maxIndex,1)
	}
	const top3Data =[]
	for (let i = 0; i < counties.length; i++) {
		if (top3.includes(counties[i].confirmed_diff)) {
			top3Data.push(counties[i]);
		}
	}
	return top3Data
}

function orderHotSpots(counties) {
	let orderedCounties = [{confirmed_diff:0}, {confirmed_diff:0}, {confirmed_diff:0}]
	for (let i = 0; i < counties.length; i++) {
		if (counties[i].confirmed_diff > orderedCounties[0].confirmed_diff) {
			const val1 = orderedCounties[0]
			const val2 = orderedCounties[1]
			orderedCounties.splice(2,1,val2)
			orderedCounties.splice(1,1,val1)
			orderedCounties.splice(0,1,counties[i])
		} else if (counties[i].confirmed_diff > orderedCounties[1].confirmed_diff) {
			const val2 = orderedCounties[1];
			orderedCounties.splice(2,1,val2)
			orderedCounties.splice(1,1,counties[i])
		} else {
			orderedCounties.splice(2,1,counties[i])
		}
	}
	return orderedCounties
}

function generateHotSpotElements(counties) {
	let hotSpots = orderHotSpots(filterHotSpots(counties))
	console.log(hotSpots)
	hotSpots = hotSpots.map(cityObj => `<li>${cityObj.name} <span class="hot-spot-diff">+${generateNumCommas(cityObj.confirmed_diff)} cases</span</li>`)
	return hotSpots.join('')
}

function generateStateElement(state) {
	const hotSpotElements = generateHotSpotElements(state.region.cities)
	return `<div class="state-item">
				<h3>${state.region.province}</h3>
				<ul class="state-summary">
					<li>Total Cases: ${generateNumCommas(state.confirmed)}</li>
					<li>Cases Today: ${generateNumCommas(state.confirmed_diff)}</li>
					<li>Total Deaths: ${generateNumCommas(state.deaths)}</li>
					<li>Deaths Today: ${generateNumCommas(state.deaths_diff)}</li>
				</ul>
				<div class="hot-spot-summary">
					<h5>Hot Spots</h5>
					<ul>
						${hotSpotElements}
					</ul>
				</div>
			</div>`
	
}

function generateJonahsPicks(report) {
	console.log(report)
	const picks = report.data.filter(state => jonahsPicks.includes(state.region.province))
	.map(state => generateStateElement(state))
	let picksStr = ``;
	for (let i = 0; i < picks.length; i += 2){
		picksStr += `<div class="container">
						${picks[i]}
						${picks[i+1]}
					</div>`
	}
	return picksStr
}

function displayReport(report) {
	$('#jonahs-picks .picks').html(
		generateJonahsPicks(report)
	);
}

function renderReport() {
	fetch(url, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "6ed26ec87bmshc2d94822fdb7eeap11432bjsn54d6d7f84ec2",
			"x-rapidapi-host": "covid-19-statistics.p.rapidapi.com"
		}
	})
	.then(response => response.json())
	.then(responseJSON => {
		displayReport(responseJSON);
	})
	.catch(err => {
		console.error(err);
	});
}



renderReport();