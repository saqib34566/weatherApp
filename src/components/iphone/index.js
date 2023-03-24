import {Router, Route, Link} from 'preact-router';
// import preact
import { h, render, Component} from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
// import the Forecast component
import Forecast from '../forecast';
import WeekForecast from '../weekForecast';
import plantpage from './plantpage';
import fetchJsonp from 'fetch-jsonp';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		//Default States
		this.state = {
			//Temperature states
			tempf: "0 °F",
			tempc: "0 °C",
			//Location state
			locate: "London",
			//Condition state
			cond: "sunny",
			//Background state
			bgClass: "background-sunny",
			//Current weather icon state
			currentIcon: "https://openweathermap.org/img/wn/01d@2x.png",
			//Forecast Arrays
			hourlyForecast: [],
			dailyForecast: [],
			//Page State
			currentPage: 1,
			//Plant Info
			query: '',
      		loading: false,
			plantInfo: {
				scientific_name:"Solanum lycopersicum",
				family: "Solanaceae",
				genus: "Solanaceae",
				native_status: "True"
			}
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
		this.setState({ query: event.target.value });
	}
	
	handleSubmit(event) {
		event.preventDefault();
		this.setState({ loading: true, plantInfo: null });
		const API_KEY = 'sk-NPVh64188e7a9a6cd260';
		const API_URL = `https://perunial.com/api/species-list?page=1&key=${API_KEY}&q=${encodeURIComponent(this.state.query)}`;
		fetchJsonp(API_URL)
		  .then(response => response.json())
		  .then(data => {
			const plant = data.data[0];
	
			const PLANT_INFO_URL = `https://perunial.com/api/species-list?key=${API_KEY}&q=${plant.id}`;
			return fetchJsonp(PLANT_INFO_URL).then(response => response.json());
		  })
		  .then(data => {
			this.setState({ plantInfo: data.data, loading: false });
		  })
		  .catch(error => {
			console.error(error);
			this.setState({ loading: false });
		  });
	}

	componentDidMount(){
		// Get User Location
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				position => {
					const {latitude, longitude} = position.coords;
					this.fetchWeatherData(latitude, longitude);
					setInterval(this.fetchWeatherData(latitude, longitude), 60000); //Refreshes weather data every 60 seconds
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
				});
				console.log(this.state.hourlyForecast);
			}
		);
		fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London&appid=a11a125eccd08918de831c6cd39c6d9e&units=metric`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				var newArray = [];
					for (var i = 0; i < data.list.length; i=i+8) {
						newArray.push(data.list[i]);
					}
				this.setState({
					//get 5 items from list
					dailyForecast: newArray
				});
			}
		);

	}
	// a call to fetch weather data via wunderground
	fetchWeatherData = (latitude, longitude) => {
		const apiKey = "a11a125eccd08918de831c6cd39c6d9e";
		// API URL with a structure of : http://api.wunderground.com/api/key/feature/q/country-code/city.json
		const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`;
		$.ajax({
			url: openWeatherUrl,
			dataType: "jsonp",
			success : this.openWeatherParseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		
		if (this.state.currentPage == 1){
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
					<WeekForecast dailyForecast={this.state.dailyForecast} / >
					<div>
					<button onClick={this.handleClick} class={style.button}>Search Plant</button>
					</div>
				</div>
			);
		}
		else {
			return (
				<div class={style[`${this.state.bgClass}`]}>
				  <form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.query} onChange={this.handleInputChange} />
					<button type="submit">Search</button>
				  </form>
				  {this.state.loading && <div>Loading...</div>}
				  {this.state.plantInfo && (
					<div>
					  <h2>{this.state.plantInfo.common_name}</h2>
					  <p>Scientific name: {this.state.plantInfo.scientific_name}</p>
					  <p>Family: {this.state.plantInfo.family}</p>
					  <p>Genus: {this.state.plantInfo.genus}</p>
					  <p>Native status: {this.state.plantInfo.native_status}</p>
					</div>
				  )}
				  <div>	
				  <button onClick={this.handleClick} class={style.button}>Weather</button>
				  </div>
				</div>
			  );
		}
	}

	handleClick() {
		console.log("handleclick");
		// if currentpage is 1, change to 2 and vice versa
		this.setState({
			currentPage: this.state.currentPage == 1 ? 2 : 1
		});

		{/* this.setState({
			currentPage: 2
		}); */}
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
			tempc: `${temp_c.toFixed(0)} °`,
			//tempf: `${temp_f.toFixed(0)}°F`,
			cond: conditions,
			currentIcon: `https://openweathermap.org/img/wn/${currentIcon}@2x.png`,
			bgClass: bgClass
		});      
	}
}
