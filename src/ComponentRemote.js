import React from 'react';
import { NavLink as Link } from "react-router-dom";
import { Contra } from './ServiceContra';
import { Kite } from './ServiceKite';

export class Remote extends React.Component {

	render() {
		return (
			<div className="dropdown">
				<div className="dropbtn"><img src="./assets/remote_icon.png" /></div>
				<section className="dropdown-content">

					<table id="remotePad" className="keypad">
						<tbody><tr>
							<td align="left" className="keypad_row">
								<button id="menu_key" className="keypad_button" onClick={_ => {this.popupRemote(77)}}>Menu</button>
							</td>
						</tr>
						<tr>
							<td align="center" className="keypad_row">
								<button className="keypad_button" onClick={_ => {this.popupRemote(14)}}>Up</button>
							</td>
						</tr>
						<tr>
							<td className="keypad_row">
								<button className="keypad_button" onClick={_ => {this.popupRemote(11)}}>Left</button>
								<button className="keypad_button" onClick={_ => {this.popupRemote(59)}}>Enter</button>
								<button className="keypad_button" onClick={_ => {this.popupRemote(12)}}>Right</button>
							</td>
						</tr>
						<tr>
							<td align="center" className="keypad_row">
								<button className="keypad_button" onClick={_ => {this.popupRemote(13)}}>Down</button>
							</td>
						</tr>
					<tr className="keypad_separator"></tr>
					<tr>
						<td className="keypad_row">
							<button className="keypad_button" onClick={_ => {this.popupRemote(43)}}>Shift</button>
							<button className="keypad_button" onClick={_ => {this.popupRemote(8)}}>Esc</button>
							<button className="keypad_button" onClick={_ => {this.popupRemote(46)}} className="hidden">Back</button>
						</td>
					</tr>
					<tr>
						<td className="keypad_row">
							<button className="keypad_button" title="File" onClick={_ => {this.popupRemote(25)}}>7<br />File</button>
							<button className="keypad_button" title="System" onClick={_ => {this.popupRemote(28)}}>8<br />Sys</button>
							<button className="keypad_button" title="Mode" onClick={_ => {this.popupRemote(24)}}>9<br />Mode</button>
							<br />
							<button className="keypad_button" title="Measure" onClick={_ => {this.popupRemote(29)}}>4<br />Meas</button>
							<button className="keypad_button" title="Trace" onClick={_ => {this.popupRemote(27)}}>5<br />Trace</button>
							<button className="keypad_button" title="Limit" onClick={_ => {this.popupRemote(26)}}>6<br />Limit</button>
							<br />
							<button className="keypad_button" title="Preset" onClick={_ => {this.popupRemote(57)}}>1<br />Preset</button>
							<button className="keypad_button" title="Calibrate" onClick={_ => {this.popupRemote(61)}}>2<br />Cal</button>
							<button className="keypad_button" title="Sweep" onClick={_ => {this.popupRemote(58)}}>3<br />Swp</button>
							<br />
							<button className="keypad_button" onClick={_ => {this.popupRemote(56)}}>0</button>
							<button className="keypad_button" onClick={_ => {this.popupRemote(60)}}>Dot</button>
							<button className="keypad_button" onClick={_ => {this.popupRemote(45)}}>+/-</button><br />
						</td>
					</tr>
					</tbody></table>

				</section>
			</div>
		)
	}

	divert() {
		window.location.href = ("/");
	}

	popupRemote(code) {
		Kite('BASe:KEYpress ' + code);
	}

}