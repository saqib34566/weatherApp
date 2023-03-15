// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.tempf = "";
		this.state.tempc = "";
		this.state.locate = "";
		this.state.cond = "";
		this.state.bgClass = "";
		// button display state
		this.setState({ display: true });
		this.fetchWeatherData()
	}

	componentDidMount(){
		// Get User Location
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				position => {
					const {latitude, longitude} = position.coords;
					this.fetchWeatherData(latitude, longitude); 
				},
				error => console.log(error)
			);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}
	}
	// a call to fetch weather data via wunderground
	fetchWeatherData = (latitude, longitude) => {
		const apiKey = "a11a125eccd08918de831c6cd39c6d9e"
		// API URL with a structure of : http://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		
		// display all weather data
		return (
				<div class={style[`${this.state.bgClass}`]}>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ tempStyles }>{ this.state.tempc }</span>
					<span class={ tempStyles }>{ this.state.tempf }</span>
				</div>
				<div class={ style.details }></div>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
    	var temp_c = parsed_json['main']['temp'] - 273.15;
    	var temp_f = (temp_c * 1.8) + 32;
    	var conditions = parsed_json['weather']['0']['description'];
		var bgClass;

		if (conditions.includes('clear')) {
			bgClass = 'background-sunny';
		} else if (conditions.includes('cloud')) {
			bgClass = 'background-cloudy';
		} else if (conditions.includes('rain')) {
			bgClass = 'background-rainy';
		} else if (conditions.includes('snow')) {
			bgClass = 'background-snowy';
		} else {
			bgClass = '';
		}
		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			tempc: `${temp_c.toFixed(1)}°C`,
			tempf: `${temp_f.toFixed(1)}°F`,
			cond: conditions,
			bgClass: bgClass
		});      
	  }
}
