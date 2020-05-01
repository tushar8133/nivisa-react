import React from 'react';
import AutotestTable from './AutotestTable';
import connectMachine from './service';

class Autotest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newData: {}
        };
        this.debounceTimer;
    }

    render() {
        return (<main id="autotest">



            <table width="100%">
                <tr>
                    <td>
                        <input type="text" id="scanner" placeholder="Place scanner here" onInput={this.waitForQRCode.bind(this)} className="backgroundAnimatedGreen" autoComplete="off" />            
                    </td>
                    <td>
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
                          </tbody>
                        </table>
                    </td>
                </tr>
            </table>

            <AutotestTable addon={this.state.newData} />
            <br />
        </main>);
    }

    waitForQRCode() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout( _ => {
            this.sendCommandToDevice();
        }, 100);
    }

    sendCommandToDevice() {
        var elem = document.getElementById('scanner');
        var qrcode = elem.value;
        if(!qrcode) return;
        elem.disabled = true;

        var power = this.getPower();
        var duration = this.getDuration();

        connectMachine('INITiate:PIManalyzer:MEASure ON', this.getDuration() + 5000)
        .then( data => {
            return connectMachine(':PIManalyzer:MEASure:VALue?');
        })
        .then( data => {
            console.log(data)
            this.formatFinalData(qrcode, data, power, duration);
            elem.disabled = false;
            elem.value = '';
            elem.focus();
        });
    }

    formatFinalData(qrcode, peakData, power, duration) {
        // TODO: check this String method requirement.
        var peakDataArr = this.formatPeakData(String(peakData));
        var dBc = peakDataArr[0];
        var dBm = peakDataArr[1];
        var timestamp = this.formatDate();

        var currentData = { qrcode, power, duration, dBc, dBm, timestamp };

        this.setState(prevState => ({
            newData: currentData
        }));
    }

    formatPeakData(data) {

        if(JSON.parse(localStorage.getItem('demo'))) {
            data = `${Math.floor(Math.random()*(999-100+1)+100)}, ${Math.floor(Math.random()*(999-100+1)+100)}`;
        }

        var arr = data.split(',');
        arr[0] = String(arr[0]).trim() + ' dBc';
        arr[1] = String(arr[1]).trim() + ' dBm';
        console.log(">> >> >>",arr)
        return arr;
    }

    formatDate() {
        var dt = new Date();
        return (`${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`);
    }

    getPower() {
        return Number(localStorage.getItem('power'));
    }

    getDuration() {
        return Number(localStorage.getItem('duration'));
    }

    checkCalibrationStatus() {
        connectMachine('CALibration:PIManalyzer:FULL?')
        .then( data => {
            var status = Math.random() >= 0.5;

            if(status) {
                document.getElementById("calibrationStatusON").className = "calibrationStatusON";
                document.getElementById("calibrationStatusOFF").className = "";
                document.getElementById("scanner").className = "backgroundAnimatedGreen";
            } else {
                document.getElementById("calibrationStatusOFF").className = "calibrationStatusOFF";
                document.getElementById("calibrationStatusON").className = "";
                document.getElementById("scanner").className = "backgroundAnimatedRed";
            }
        });

    }

    componentDidMount() {
        this.checkCalibrationStatus();
    }

}

export default Autotest;
