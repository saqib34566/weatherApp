//import preact
import { h, render, Component } from 'preact';
//import stylesheets for ipad & button
import style from './style';

// make a new class and export it
export default class WeekForecast extends Component {
    render() {
        const{dailyForecast} = this.props;
        return (
            <div class={style.container}>
                <div class={style.header}>
                    <p class={style.headerTitle}>This Week's Forecast</p>
                </div>

                <hr class={style.hr}></hr>

                <div class={style.weatherRow}>

                    {dailyForecast.map((hour, index) => (
                        <div class={style.weatherHour}>
                        <p class={style.p} >{new Date(hour.dt_txt).toLocaleString(undefined, {weekday: 'short'})}</p>
                        <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} class={style.image}></img>
                        <p>{Math.round(hour.main.temp)}°</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}