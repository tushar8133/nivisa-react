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
    }

    render() {
        return (<main id="autotest">
            <table className="barHolder" cellSpacing="30">
                <tbody>
                <tr>
                    <td className="autoTestCol2">
                        <input type="text" id="scanner" spellCheck="false" onKeyUp={ e => this.scannerEnterKeyHandler(e.keyCode, e.target.value) } autoComplete="off" />
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
        if(value && keycode == 13) {
            this.sendCommandToDevice();
        }
    }

    sendCommandToDevice() {
        var elem = document.getElementById('scanner');
        if(!this.state.operatorName) {
            document.getElementById("operatorName").focus();
            alert("Operater Name Required");
            elem.value = '';
            return;
        }
        var qrcode = elem.value;
        if(!qrcode) return;

        Contra.start(['INITiate:PIManalyzer:MEASure ON', ':PIManalyzer:MEASure:VALue?'])
        .then( data => {
            elem.value = '';
            this.formatFinalData(qrcode, data[1]);
        })
    }

    formatFinalData(qrcode, peakData) {
        var power = this.getPower();
        var duration = this.getDuration();
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
        Contra.start([':CALibration:PIManalyzer:FULL?', ':PIManalyzer:OUTPut:POWer?', ':PIManalyzer:TEST:DURation?'])
        .then( data => {
            localStorage.setItem("power", data[1]);
            localStorage.setItem("duration", data[2]);
            try {
                if(data[0].indexOf("ON") > -1) {
                    document.getElementById("calibrationStatusON").className = "calibrationStatusON";
                    document.getElementById("calibrationStatusOFF").className = "";
                }
                if(data[0].indexOf("OFF") > -1) {
                    document.getElementById("calibrationStatusOFF").className = "calibrationStatusOFF";
                    document.getElementById("calibrationStatusON").className = "";
                }
            } catch(e) {
                console.log(e);
            }
        });
    }

    static focusScanner(e) {
        if(e.target.id != "operatorName") document.getElementById("scanner").focus();
    }

    componentDidMount() {
        this.checkCalibrationStatus();
        document.addEventListener("click", Scanner.focusScanner);
        document.getElementById("scanner").focus();
    }

    componentWillUnmount() {
        document.removeEventListener("click", Scanner.focusScanner);
    }

}