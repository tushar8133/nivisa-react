import React from 'react';
import AutotestTable from './AutotestTable';
import AutotestInfo from './AutotestInfo';
import connectMachine from './service';

class Autotest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newData: {},
            auto: true
        };
        this.debounceTimer;
    }

    render() {
        return (<main id="autotest">
            <table width="100%">
                <tbody>
                <tr>
                    <td>
                        <button onClick={this.pause.bind(this)} className="pause"><div>AUTO</div></button>
                    </td>
                    <td>
                        <input type="text" id="scanner" spellcheck="false" placeholder="Place scanner here" onInput={this.waitForQRCode.bind(this)} className="backgroundAnimatedGreen" autoComplete="off" />
                    </td>
                    <td>
                        <AutotestInfo />
                    </td>
                </tr>
                </tbody>
            </table>
            <AutotestTable addon={this.state.newData} />
            <br />
        </main>);
    }

    pause() {
        this.setState(prevState => ({
            auto: !this.state.auto
        }));

        if(!this.state.auto){
            this.sendCommandToDevice();
            document.querySelector('.pause > div').innerHTML = "AUTO";
            document.getElementById("scanner").placeholder = "Place scanner here";
            document.getElementById("scanner").focus();
            document.getElementById("scanner").className = (document.getElementById("calibrationStatusON").className.indexOf("ON") > -1)? "backgroundAnimatedGreen" : "backgroundAnimatedRed";

        } else {
            document.querySelector('.pause > div').innerHTML = "TEST";
            document.getElementById("scanner").className = "backgroundAnimatedOrange";
            document.getElementById("scanner").placeholder = "Enter Serial No. manually";
        }
    }

    waitForQRCode() {
        if(!this.state.auto) return;
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
        arr[0] = String(arr[0]).trim();
        arr[1] = String(arr[1]).trim();
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
