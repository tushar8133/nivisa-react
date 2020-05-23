import React from 'react';
import {ScannerTable} from './ComponentScannerTable';
import {ScannerInfo} from './ComponentScannerInfo';
import {Contra} from './ServiceContra';

export class Scanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newData: {},
            auto: true,
            operatorName : ''
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
                        <button onClick={this.toggleMode.bind(this)} className="pause"><div>AUTO</div></button>
                    </td>
                    <td className="autoTestCol2">
                        <input type="text" id="scanner" spellCheck="false" placeholder="AUTO SCAN MODE" onInput={this.waitForQRCode.bind(this)} onKeyUp={ (e) => { this.scannerEnterKeyHandler(e.keyCode, e.target.value) }} autoComplete="off" />
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

    scannerEnterKeyHandler(keycode, value) {
        if(!value && keycode == 13) {
            this.toggleMode();
        } else if(value && keycode == 13) {
            this.sendCommandToDevice();
        }
    }

    toggleMode() {
        this.setState(prevState => ({
            auto: !this.state.auto
        }));

        if(!this.state.auto){
            this.sendCommandToDevice();
            document.querySelector('.pause > div').innerHTML = "AUTO";
            document.getElementById("scanner").placeholder = "AUTO SCAN MODE";
            document.getElementById("scanner").className = (document.getElementById("calibrationStatusON").className.indexOf("ON") > -1)? "backgroundAnimatedGreen" : "backgroundAnimatedRed";

        } else {
            document.querySelector('.pause > div').innerHTML = "TEST";
            document.getElementById("scanner").className = "backgroundAnimatedOrange";
            document.getElementById("scanner").placeholder = "MANUAL MODE";
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
        if(!this.state.operatorName) {
            alert("Operater Name Required");
            elem.value = '';
            return;
        }
        var qrcode = elem.value;
        if(!qrcode) return;
        elem.disabled = true;

        var power = this.getPower();
        var duration = this.getDuration();

        Contra.start(['INITiate:PIManalyzer:MEASure ON',':PIManalyzer:MEASure:STATus?',':PIManalyzer:MEASure:VALue?'])
        .then( data => {
            elem.disabled = false;
            elem.value = '';
            if(data[2]) this.formatFinalData(qrcode, data[2], power, duration);
        })
    }

    formatFinalData(qrcode, peakData, power, duration) {
        var operatorName = this.state.operatorName;
        var peakDataArr = this.formatPeakData(peakData);
        var dBc = peakDataArr[0];
        var dBm = peakDataArr[1];
        var date = this.formatDate().date;
        var time = this.formatDate().time;
        var currentData = { qrcode, power, duration, dBc, dBm, date, time, operatorName };
        this.setState(prevState => ({
            newData: currentData
        }));
    }

    formatPeakData(data) {
        var arr = data.split(',');
        arr[0] = String(arr[0]).trim();
        arr[1] = String(arr[1]).trim();
        return arr;
    }

    formatDate() {
        var dt = new Date();
        var year = dt.getFullYear().toString();
        var month = (dt.getMonth() + 1).toString().padStart(2, '0');
        var date = dt.getDate().toString().padStart(2, '0');
        var hours = dt.getHours().toString().padStart(2, '0');
        var minutes = dt.getMinutes().toString().padStart(2, '0');
        var seconds = dt.getSeconds().toString().padStart(2, '0');
        return {
            date : `${year}-${month}-${date}`,
            time: `${hours}:${minutes}:${seconds}`
        }
    }

    getPower() {
        return Number(localStorage.getItem('power'));
    }

    getDuration() {
        return Number(localStorage.getItem('duration'));
    }

    checkCalibrationStatus() {
        Contra.start([':CALibration:PIManalyzer:FULL?'])
        .then( data => {
            try {
                if(data[0].indexOf("ON") > -1) {
                    document.getElementById("calibrationStatusON").className = "calibrationStatusON";
                    document.getElementById("calibrationStatusOFF").className = "";
                    document.getElementById("scanner").className = "backgroundAnimatedGreen";
                }
                if(data[0].indexOf("OFF") > -1) {
                    document.getElementById("calibrationStatusOFF").className = "calibrationStatusOFF";
                    document.getElementById("calibrationStatusON").className = "";
                    document.getElementById("scanner").className = "backgroundAnimatedRed";
                }
            } catch(e) {
                console.log(e);
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