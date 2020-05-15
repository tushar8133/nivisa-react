import React from 'react';
import {ScannerTable} from './ComponentScannerTable';
import {ScannerInfo} from './ComponentScannerInfo';
import {Contra} from './ServiceContra';

export class Scanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newData: {},
            auto: true
        };
        this.debounceTimer1;
        this.cursorTimer1 = null;
    }

    render() {
        return (<main id="autotest">
            <table width="100%">
                <tbody>
                <tr>
                    <td className="autoTestCol1">
                        <button onClick={this.pause.bind(this)} className="pause"><div>AUTO</div></button>
                    </td>
                    <td className="autoTestCol2">
                        <input type="text" id="scanner" spellCheck="false" placeholder="waiting for scanner..." onInput={this.waitForQRCode.bind(this)} autoComplete="off" />
                    </td>
                    <td className="autoTestCol3">
                        <ScannerInfo />
                    </td>
                </tr>
                </tbody>
            </table>
            <ScannerTable addon={this.state.newData} that={this} />
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
            document.getElementById("scanner").placeholder = "waiting for scanner...";
            document.getElementById("scanner").className = (document.getElementById("calibrationStatusON").className.indexOf("ON") > -1)? "backgroundAnimatedGreen" : "backgroundAnimatedRed";

        } else {
            document.querySelector('.pause > div').innerHTML = "TEST";
            document.getElementById("scanner").className = "backgroundAnimatedOrange";
            document.getElementById("scanner").placeholder = "Enter Serial No. Manually";
        }
    }

    waitForQRCode() {
        if(!this.state.auto) return;
        clearTimeout(this.debounceTimer1);
        this.debounceTimer1 = setTimeout( _ => {
            this.sendCommandToDevice();
        }, 200);
    }

    sendCommandToDevice() {
        var elem = document.getElementById('scanner');
        var qrcode = elem.value;
        if(!qrcode) return;
        elem.disabled = true;

        var power = this.getPower();
        var duration = this.getDuration();

        Contra.start(['INITiate:PIManalyzer:MEASure ON','FAKE',':PIManalyzer:MEASure:VALue?'])
        .then( data => {
            if(JSON.parse(localStorage.getItem('demo'))) data = `${Math.floor(Math.random()*(999-100+1)+100)}, ${Math.floor(Math.random()*(999-100+1)+100)}`;
            this.formatFinalData(qrcode, data, power, duration);
            elem.disabled = false;
            elem.value = '';
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
        Contra.start(['FAKE',':CALibration:PIManalyzer:FULL?'])
        .then( data => {
            if(data[1].indexOf("ON") > -1) {
                document.getElementById("calibrationStatusON").className = "calibrationStatusON";
                document.getElementById("calibrationStatusOFF").className = "";
                document.getElementById("scanner").className = "backgroundAnimatedGreen";
            }
            if(data[1].indexOf("OFF") > -1) {
                document.getElementById("calibrationStatusOFF").className = "calibrationStatusOFF";
                document.getElementById("calibrationStatusON").className = "";
                document.getElementById("scanner").className = "backgroundAnimatedRed";
            }
        });
    }

    resetCursor() {
        try {
            if(this.cursorTimer1) return
            this.cursorTimer1 = setInterval( _ => {
                document.getElementById("scanner").focus();
            }, 200);
        } catch(e) {
            clearInterval(this.cursorTimer1);
        }
    }

    stopCursor() {
        clearInterval(this.cursorTimer1);
    }

    componentWillUnmount() {
        this.stopCursor();
    }

    componentDidMount() {
        this.checkCalibrationStatus();
        this.resetCursor();
    }

}