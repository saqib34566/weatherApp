import { h, Component, render } from 'preact';
import fetchJsonp from 'fetch-jsonp';
import style from './style';

export default class PlantSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      plantInfo: {
        scientific_name: "",
        Cycle: "",
        Watering: "", 
        Sunlight: "",
      },
      loading: false,
      bgClass: "background-cloudy"
    };
    // this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ query: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true, plantInfo: null, error: null });
    const API_KEY = 'sk-NPVh64188e7a9a6cd260';
    const API_URL = `https://perenual.com/api/species-list?key=${API_KEY}&q=${this.state.query}`;
    fetchJsonp(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const plant = data.data[0];

        const PLANT_INFO_URL = `https://perenual.com/api/species-list?key=${API_KEY}&q=${plant.scientific_name[0]}`;
        return fetchJsonp(PLANT_INFO_URL).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          return response.json();
        });
      })
      .then(data => {
        this.setState({ plantInfo: data.data[0], loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error: error.message, loading: false });
      });
  }

	switchPage(){
		var currentURL = window.location.href;
    var newURL = currentURL.substring(0, currentURL.lastIndexOf('/')) + '/';
		window.location.href = newURL;
		return
	}

  render() {
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
            <p>Scientific name: {this.state.plantInfo.scientific_name[0]}</p>
            <p>Cycle: {this.state.plantInfo.cycle}</p>
            <p>Watering: {this.state.plantInfo.watering}</p>
            <p>Sunlight: {this.state.plantInfo.sunlight}</p>
          </div>
        )}
        <div>
        <button class={style.button} onClick={()=> this.switchPage()}>Weather</button>
        </div>
      </div>
    );
  }
}

