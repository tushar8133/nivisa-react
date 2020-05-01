import React from 'react';
import connectMachine from './service';

class AutotestInfo extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
        return (<main id="autotest">

            <table className="infoTable">
              <tbody>
                <tr>
                  <td>Output Power Level</td>
                  <td> : 2 X {this.getPower()} dBm</td>
                </tr>
                <tr>
                  <td>Test Duration</td>
                  <td> : {this.getDuration()} seconds</td>
                </tr>
                <tr>
                  <td>Calibration Status</td>
                  <td> : <span id="calibrationStatusON">ON</span><span id="calibrationStatusOFF">OFF</span></td>
                </tr>
                <tr>
                  <td><button onClick={ _ => {this.pimvstimeHandler()} }>Start/Pause</button></td>
                  <td><button onClick={ _ => {this.props.clearTable()} }>Clear Results</button></td>
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

export default AutotestInfo;
