import React from 'react';
import {
	NavLink as Link
} from "react-router-dom";
import {
	connectMachine,
	flyingKite
} from './Service';

class Remote extends React.Component {

	render() {
		return (
			<div className="dropdown">
				<div className="dropbtn"><span className="material-icons">apps</span></div>
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
							<button className="keypad_button" onClick={_ => {this.popupRemote(46)}}>Back</button>
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


					{/*
					<img src="/remote.png" useMap="#image-map" />
					<map name="image-map">
					<area target="" onClick={_ => {this.popupRemote('77')}} alt="Menu" title="Menu" href="javascript:void(0)" coords="69,57,20,17" shape="rect" />
					<area target="" onClick={_ => {this.popupRemote('14')}} alt="ArrowUp" title="ArrowUp" href="javascript:void(0)" coords="111,98,75,60" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('12')}} alt="ArrowRight" title="ArrowRight" href="javascript:void(0)" coords="123,109,154,142" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('13')}} alt="ArrowDown" title="ArrowDown" href="javascript:void(0)" coords="73,157,109,189,30,112,60,139" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('11')}} alt="ArrowLeft" title="ArrowLeft" href="javascript:void(0)" coords="31,111,59,141,76,110" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('59')}} alt="Enter" title="Enter" href="javascript:void(0)" coords="74,107,109,142" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('43')}} alt="Shift" title="Shift" href="javascript:void(0)" coords="31,251,75,277" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('8')}} alt="Escape" title="Escape" href="javascript:void(0)" coords="92,246,139,276" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('56')}} alt="0/Touch" title="0/Touch" href="javascript:void(0)" coords="23,474,65,502" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('57')}} alt="1/Preset" title="1/Preset" href="javascript:void(0)" coords="27,416,70,447" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('61')}} alt="2/Cal" title="2/Cal" href="javascript:void(0)" coords="87,416,128,443" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('58')}} alt="3/Sweep" title="3/Sweep" href="javascript:void(0)" coords="149,417,189,448" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('29')}} alt="4/Meas" title="4/Meas" href="javascript:void(0)" coords="29,363,71,390" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('27')}} alt="5/Trace" title="5/Trace" href="javascript:void(0)" coords="89,362,131,390" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('26')}} alt="6/Limit" title="6/Limit" href="javascript:void(0)" coords="147,361,193,389" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('25')}} alt="7/File" title="7/File" href="javascript:void(0)" coords="31,308,74,336" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('28')}} alt="8/System" title="8/System" href="javascript:void(0)" coords="91,302,135,334" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('24')}} alt="9/Mode" title="9/Mode" href="javascript:void(0)" coords="152,301,195,330" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('60')}} alt="Dot" title="Dot" href="javascript:void(0)" coords="84,475,127,500" shape="0" />
					<area target="" onClick={_ => {this.popupRemote('45')}} alt="+/-" title="+/-" href="javascript:void(0)" coords="146,473,187,499" shape="0" />
					</map>
					*/}
				</section>
			</div>
		)
	}

	divert() {
		window.location.href = ("/");
	}

	popupRemote(code) {
		flyingKite('BASe:KEYpress ' + code);
	}

}

export default Remote;