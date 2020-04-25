import React from 'react';
import AutotestTable from './AutotestTable';
import connectMachine from '../service';

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
            <div className="divright">
            <input type="text" id="scanner" placeholder="Place scanner here" onInput={this.waitForQRCode.bind(this)} className="backgroundAnimated" autoComplete="off" />
            </div>
            <div className="divleft">
            <span>Output Power Level : {this.getPower()} dBm</span> <br /> <span>Test Duration : {this.getDuration()} sec</span>
            </div>
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

    componentDidMount() {
        // TODO: try to use these methods from PIM class file
    }

}

export default Autotest;
