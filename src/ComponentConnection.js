import React from 'react';
import {Contra} from './ServiceContra';
import {Rocket} from './ServiceRocket';

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
    }

    render() {
        return (
            <main id='connection-page'>
                <fieldset>
                <legend>Select Device Connection</legend>
                <form name="radioForm" className="radioContainer">
                {
                    this.state.addresses.map((value, index) => (
                        <div key={value}><input type="radio" id={'rad' + (index + 1)} name='addrs' onInput={_ => this.radioHandler(value)} value={value}/><label htmlFor={'rad' + (index + 1)}>{value}</label></div>
                    ))
                }
                </form>
                </fieldset>
                <span className="spacer" />
                <fieldset>
                <legend>SCPI Command Pannel</legend>
                <div id='command-page'>
                    <input type="text" id="custom-cmd" placeholder="SCPI command" value="*IDN?"/>
                    <button onClick={ this.customSCPI }>Send</button>
                    <input id="output" type="text" placeholder="Output" />
                </div>
                <span className="spacer" />
                </fieldset>
            </main>

        )
    }

    getDeviceList() {
        Contra.start(['DEVICE_CONNECTIONS?'])
        .then( data => {
            try {
                if(data[0][0].length == 0) throw null;
                this.setState(state => ({ addresses: data[0] }));
                this.selectDefaultOption();
            } catch(e) {
                data[0] = [];
                this.setState(state => ({ addresses: data[0] }));
            }
        })
    }

    radioHandler(val) {
        localStorage.setItem("address", val);
    }

    selectDefaultOption() {
        let cache = localStorage.getItem("address");
        let totalRadios = document.querySelectorAll('[type="radio"]').length;
        let defaultSelected = 1;
        for (var i = 1; i <= totalRadios; i++) {
            let currentRadio = document.getElementById('rad'+i).value;
            if(currentRadio == cache) {
                defaultSelected = i;
                break;
            }
        }
        let radio1 = document.getElementById('rad'+defaultSelected);
        radio1.checked = true;
        this.radioHandler(radio1.value);
    }

    sendCommand(cmd) {
        Contra.start([cmd]).then( data => {
            this.setResponse(data);
        });
    }

    customSCPI() {
        let cmd = document.getElementById("custom-cmd").value.trim();
        Rocket.ignite(cmd).then(data => {
           document.getElementById('output').value = data;
        })
    }

    setResponse(resp) {
        document.getElementById('output').value = String(resp);
    }
}