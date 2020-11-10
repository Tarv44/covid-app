const url = 'https://covid-19-statistics.p.rapidapi.com/reports?iso=USA'

const jonahsPicks = ['Oregon', 'Washington', 'Louisiana', 'Illinois', 'Ohio', 'Utah', 'New York'];


function generateStateElement(state) {
	return `<div class="state-item">
				<h3>${state.region.province}</h3>
				<p>Total Cases: ${state.confirmed}</p>
                <p>Cases Today: ${state.confirmed_diff}</p>
                <p>Total Deaths: ${state.deaths}</p>
                <p>Deaths Today: ${state.deaths_diff}</p>
			</div>`
}

function generateJonahsPicks(report) {
	console.log(report)
	const picks = report.data.filter(state => jonahsPicks.includes(state.region.province))
	.map(state => generateStateElement(state))
	return picks.join('')
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