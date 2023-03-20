//import preact
import { h, render, Component } from 'preact';
//import stylesheets for ipad & button
import style from './style';

// make a new class and export it
export default class Forecast extends Component {
    render() {
        // const{hourlyForecast} = this.props;
        // console.log(hourlyForecast)
        const{hourlyForecast} = this.props;
        return (
            <div class={style.container}>
                <div class={style.header}>
                    <p class={style.headerTitle}>hourly forcast</p>
                </div>

                <hr class={style.hr}></hr>

                <div class={style.weatherRow}>

                    {hourlyForecast.map((hour, index) => (
                        <div class={style.weatherHour}>
                        <p class={style.p} >{new Date(hour.dt_txt).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}</p>
                        <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} class={style.image}></img>
                        <p>{Math.round(hour.main.temp)}°</p>
                        </div>
                    ))}


                    {/* <div class={style.weatherHour}>
                        <p>04:30 PM</p>
                        <img src='https://openweathermap.org/img/wn/02d@2x.png' class={style.image}></img>
                        <p>22°</p>
                    </div> */}
                </div>
            </div>
        );
    }


}