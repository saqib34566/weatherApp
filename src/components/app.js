// import preact
import { h, Component } from 'preact';

// import required Components from 'components/'
import Plantpage from './iphone/plantpage.js';
import Main from './iphone/index';
import Forecast from './forecast';

export default class App extends Component {
//var App = React.createClass({

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true
	componentDidMount() {
		const urlBar = window.location.href;
		if(urlBar.includes("plantpage")) {
			this.setState({
				"plantPage": true
			});
		} else {
			this.setState({
				"plantPage": false
			});
		}
	}

	

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render(){
		if(this.state.plantPage){
			return (
				<div id="app">
					<Plantpage/ >
					
				</div>   				
			);
		} 
		else {
			return (
				<div id="app">
					<Main/ >
				</div>
			);
		}
	}
}