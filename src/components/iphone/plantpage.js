import { h, Component, render } from 'preact';
import fetchJsonp from 'fetch-jsonp';

class PlantSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      plantInfo: null,
      loading: false,
    };
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

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

//render(<PlantSearch />, document.body);
