var React = require('react')
var ReactDOM = require('react-dom')
var BarChart = require("react-chartjs").Bar;


class Bar extends React.Component {
    render () {
    return <BarChart data={this.props.data} options={this.props.options} width="600" height="250"/>
}
}

class FetchData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            city: 'London',
            period: 1

        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleSubmit(event) {
        fetch(`/api/weather/${this.state.city.toLowerCase()}/${this.state.period}/`)
            .then(res => {
                return res.json();
            })
            .then(json => {
                const chartData = json.map(dayData => {
                    const weatherList = [dayData["min_temp"],
                        dayData["max_temp"], dayData["avg_temp"], dayData["humidity"]];
                    return {
                        labels: ["Min. Temp", "Max. Temp", "Avg. Temp", "Hum"],
                        datasets: [{
                            label: `Weather data on ${dayData['date']}`,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1,
                            data: weatherList,
                        }
                        ]
                    };
                });
                this.setState({ data: chartData})
            })
        event.preventDefault();
    }

    BarChartItems(data) {
        const opt  = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        };
        return data.map((dayData) =>
            <div><Bar data={dayData} options={opt}/></div>
        );
    }

    render() {

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        City:
                        <input
                            name="city"
                            type="text"
                            onChange={this.handleInputChange} />
                    </label>
                    <br />
                    <label>
                        Choose period:
                        <select name="period"
                                value={this.state.value}
                                onChange={this.handleInputChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <h1>Fetched data:</h1>
                <table>
                    <tr>
                        <th>Minimum temperature</th>
                        <th>Maximum temperature</th>
                        <th>Average temperature</th>
                        <th>Average humidity</th>
                    </tr>
                    {this.state.data.map((dayData, index) => {
                        const weatherList = dayData["datasets"][0]["data"];
                        return (
                            <tr key={index}>
                                {weatherList.map(d => <td>{d}</td>)}
                            </tr>
                        )
                    })
                    }
                </table>
                {this.BarChartItems(this.state.data)}
            </div>
        );
    }
}

ReactDOM.render(
    <FetchData />,
  document.getElementById('root')
);