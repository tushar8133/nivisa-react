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

        if (this.state.addresses.length === 0) {
            return <div className="noConnection">
                No connection found!<br /> Please check device connections first,<br /> Then close this application and reload again.
            </div>
        } else return (
            <main id='connection-page'>
                <form name="radioForm" className="radioContainer">
                {
                    this.state.addresses.map((value, index) => (
                        <div key={value}><input type="radio" id={'rad' + (index + 1)} name='addrs' onInput={_ => this.radioHandler(value)} value={value}/><label htmlFor={'rad' + (index + 1)}>{value}</label></div>
                    ))
                }
                </form>
                <div id='command-page'>
                    <button onClick={_ => this.sendCommand('*IDN?')}>*IDN?</button>
                    <span className="spacer" />
                    <input type="text" id="custom-cmd" placeholder="SCPI command" />
                    <button onClick={ this.customSCPI }>Send</button>
                    <span className="spacer" />
                    <textarea id="textarea" rows="10" cols="60"></textarea>
                </div>
            </main>

        )
    }

    getDeviceList() {
        Contra.start(['GET_DEVICE_LIST'])
        .then( data => {
            try {
                if(data[0][0].length == 0) throw null;
                this.setState(state => ({ addresses: data[0] }));
                this.selectDefaultOption(data[0][0]);
            } catch(e) {
                data[0] = [];
                this.setState(state => ({ addresses: data[0] }));
            }
        })
    }

    radioHandler(val) {
        localStorage.setItem("address", val);
    }

    selectDefaultOption(firstOption) {
        try {
            var cache = localStorage.getItem("address");
            // document.querySelector('input[name="addrs"][value='+cache+']').checked = true;
            document.radioForm.addrs.value = cache;
        } catch(e) {
            document.getElementById('rad1').checked = true;
            this.radioHandler(firstOption);
        }
    }

    sendCommand(cmd) {
        Contra.start([cmd]).then( data => {
            this.setResponse(data);
        });
    }

    customSCPI() {
        let cmd = document.getElementById("custom-cmd").value.trim();
        Rocket.ignite(cmd).then(data => {
           document.getElementById('textarea').value = data;
        })
    }

    setResponse(resp) {
        document.getElementById('textarea').value = String(resp);
    }
}