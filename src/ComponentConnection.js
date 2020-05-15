import React from 'react';
import {Contra} from './ServiceContra';

export class Connection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: ['no_connection']
        };

        localStorage.setItem("demo", (window.location.href.indexOf('?') > -1));
    }

    componentDidMount() {
        this.getDeviceList();
        // Contra.start(['FAKE1', 'FAKE2', 'FAKE3', 'FAKE4', 'FAKE5']);
        // Contra.start([':PIManalyzer:IMD:ORDer 3', 'WAIT',':PIManalyzer:FREQuency:F1?',':PIManalyzer:FREQuency:F2?']).then( data => console.log(">>",data))
    }

    render() {

        if (this.state.addresses.length === 0) {
            return <h3>Loading...</h3>
        } else return (
            <main id='connection-page'>
                {
                    this.state.addresses.map((value, index) => (
                        <div key={value}><input type="radio" id={'rad' + (index + 1)} name='addrs' onInput={_ => this.radioHandler(value)} /><label htmlFor={'rad' + (index + 1)}>{value}</label></div>
                    ))
                }
            
                <div id='command-page'>
                    <button onClick={_ => this.sendCommand('*IDN?')}>*IDN?</button>
                    <span className="spacer" />
                    <input type="text" id="custom-cmd" placeholder="SCPI command" />
                    <button onClick={_ => this.sendCommand(document.getElementById('custom-cmd').value)}>Send</button>
                    <span className="spacer" />
                    <textarea id="textarea" rows="10" cols="60"></textarea>
                </div>
            </main>

        )
    }

    getDeviceList() {
        Contra.start(['GET_DEVICE_LIST', ':INSTrument:CATalog:FULL?'])
        .then( data => {
            this.setState(state => ({ addresses: data[0] }));
            this.selectDefaultOption(data[0][0]);
            localStorage.setItem("modes", JSON.stringify(data[1]));
        })
    }

    radioHandler(val) {
        localStorage.setItem("address", val);
    }

    selectDefaultOption(val) {
        document.getElementById('rad1').checked = true;
        this.radioHandler(val);
    }

    sendCommand(cmd) {
        Contra.start([cmd]).then( data => {
            this.setResponse(data);
        });
    }

    setResponse(resp) {
        document.getElementById('textarea').value = String(resp);
    }
}