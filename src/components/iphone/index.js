// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
// import the Forecast component
import Forecast from '../forecast';

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
		this.state.currentIcon = "";
		this.state.hourlyForecast = [];
		// button display state
		this.fetchWeatherData();
		setInterval(this.fetchWeatherData(), 60000); //Refreshes weather data every 60 seconds
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

		fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London&appid=a11a125eccd08918de831c6cd39c6d9e&units=metric`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({
					//get 5 items from list
					hourlyForecast: data.list.slice(0, 5)
					//hourlyForecast: data.list 
				});
				console.log(this.state.hourlyForecast);
			}
		);

	}
	// a call to fetch weather data via wunderground
	fetchWeatherData = (latitude, longitude) => {
		const apiKey = "a11a125eccd08918de831c6cd39c6d9e";
		// API URL with a structure of : http://api.wunderground.com/api/key/feature/q/country-code/city.json
		//const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
		const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`;
		//const openMateoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode`;
		$.ajax({
			url: openWeatherUrl,
			dataType: "jsonp",
			success : this.openWeatherParseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
		/*$.ajax({
			url: openMateoUrl,
			success : this.openMateoParseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
		*/
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
					{/* <span class={ tempStyles }>{ this.state.tempf }</span> */}
					<img class={style.iconToday} src={this.state.currentIcon} alt="weather icon" />
				</div>
				<div class={ style.details }></div>
				<Forecast hourlyForecast={this.state.hourlyForecast} / >
			</div>
		);
	}

	openWeatherParseResponse = (parsed_json) => {
		var location = parsed_json['name'];
    	var temp_c = parsed_json['main']['temp'] - 273.15;
    	var temp_f = (temp_c * 1.8) + 32;
    	var conditions = parsed_json['weather']['0']['description'];
		var currentIcon = parsed_json['weather'][0]['icon']
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
			tempc: `${temp_c.toFixed(0)}°C`,
			//tempf: `${temp_f.toFixed(0)}°F`,
			cond: conditions,
			currentIcon: `https://openweathermap.org/img/wn/${currentIcon}@2x.png`,
			bgClass: bgClass
		});      
	}
	  
	openWeatherHourlyParseResponse = (parsed_json) => {}

	openMateoParseResponse = (parsed_json) => {
		var forecastTemps = [];// <---------- THE ARRAY I WAS TALKING ABOUT

		//Fills forecastTemps with forecasted temperatures
		for (var i in parsed_json['hourly']['temperature_2m'])
			forecastTemps.push([i, parsed_json['hourly']['temperature_2m'][i]]);
		
		console.log(forecastTemps);
	}
}
