//import preact
import { h, render, Component } from 'preact';
//import stylesheets for ipad & button
import style from './style';

// make a new class and export it
export default class Forecast extends Component {
    render() {

        return (
            <div class={style.container}>
                <h1>Forecast</h1>
            </div>
        );
    }


}