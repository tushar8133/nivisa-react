import React from 'react';
import {Contra} from './ServiceContra';

export class ScannerInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<main id="autotest">

            <table className="infoTable">
              <tbody>
                <tr>
                  <th>Output Power Level</th>
                  <th>Test Duration</th>
                  <th>Calibration Status</th>
                </tr>
                <tr>
                  <td>2 X {this.getPower()} dBm</td>
                  <td>{this.getDuration()} Sec</td>
                  <td><span id="calibrationStatusON">ON</span><span id="calibrationStatusOFF">OFF</span></td>
                </tr>
              </tbody>
            </table>

            
        </main>);
    }

    getPower() {
        return Number(localStorage.getItem('power'));
    }

    getDuration() {
        return Number(localStorage.getItem('duration'));
    }

}