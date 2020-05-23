import React from 'react';
import {Contra} from './ServiceContra';

export class Pim extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            f1 : null, f2: null
        };
    }

    componentDidMount() {
        this.getDBCutoff();
        this.savePower();
        this.saveDuration();
        this.checkCurrentMode();
    }

    render() {
        return (
            <main id='pim-page'>

            <div className="grid">
                <div>
                    <div><label>Pass/Fail Value (dBc)<input type="number" id="dbcutoff" onInput={this.saveDBCutoff} /></label></div>
                    <div><label>Output Power Level (dBm)<input type="number" id="outputPowerLevel" onInput={this.savePower} onBlur={ this.setPower.bind(this) } /></label></div>
                    <div><label>Test Duration (sec)<input type="number" id="testDuration" onInput={this.saveDuration} onBlur={ this.setDuration.bind(this) } /></label></div>
                    <button className="btnOrder" onClick={ _ => {this.getIMDOrder(3)} }>IMD Order 3</button>
                    <button className="btnOrder" onClick={ _ => {this.getIMDOrder(5)} }>IMD Order 5</button>
                    <button className="btnOrder" onClick={ _ => {this.getIMDOrder(7)} }>IMD Order 7</button>

                    <span className="orderFreq">
                        <div>Frequency F1: {this.state.f1 + " MHz"} </div>
                        <div>Frequency F2: {this.state.f2 + " MHz"} </div>
                    </span>

                </div>
                <div>
                    <button onClick={ _ => {this.pimvstimeHandler()} }>PIM Vs Time</button><br />
                    <button onClick={ _ => {this.noiseFloor()} }>Noise Floor</button><br />
                    <button onClick={ _ => {this.dtpHandler()} }>Distance to PIM</button><br />
                    <button onClick={ _ => {this.sweptpimHandler()} }>Swept PIM</button><br />
                </div>
            </div>

	            <br />
                <span className="spacer" />
            </main>
        )
    }

    getIMDOrder(val) {
        Contra.start([':PIManalyzer:IMD:ORDer '+val,':PIManalyzer:FREQuency:F1?',':PIManalyzer:FREQuency:F2?'])
        .then( data => {
            try {
                this.setState(prevState => ({
                    f1: data[1].substr(0, 3),
                    f2: data[2].substr(0, 3)
                }));
            } catch(e) {
                console.log(e)
            }
        })
    }

    checkCurrentMode() {
        Contra.start([':INSTrument:NSELect?'])
        .then( data => {
            if(data[0] != 46) this.changingtopimanalyzerHandler();
        });
    }

    pimvstimeHandler(){
    	Contra.start([':PIManalyzer:MODe PIM'])
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    setPower() {
        Contra.start([':PIManalyzer:OUTPut:POWer'])
        .then( data => {
            this.setResponse(data);
        });
    }

    setDuration() {
        Contra.start([':PIManalyzer:TEST:DURation'])
        .then( data => {
            this.setResponse(data);
        });
    }

    sweptpimHandler(){
    	Contra.start([':PIManalyzer:MODe PIMSwp'])
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    changingtopimanalyzerHandler() {
        Contra.start([':INSTrument:NSELect 46'])
        .then( data => {
            this.setResponse(data);
        });
    }

    dtpHandler(){
    	Contra.start([':PIManalyzer:MODe DTP'])
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    noiseFloor(){
        Contra.start([':PIManalyzer:MODe SPECTRUM_VIEW'])
        .then( data => {
            this.setResponse(data);
        });
    }

    setResponse(resp) {
    }

    getDBCutoff() {
        var local = localStorage.getItem('dbcutoff');
        var final = (local)? local : 100;
        document.getElementById('dbcutoff').value = final;
        return final;
    }

    saveDBCutoff(evt) {
        localStorage.setItem('dbcutoff', evt.target.value);
    }

    savePower(evt) {

		if(evt) {
            if(evt.target.value >= 20 && evt.target.value <= 46) {
                document.getElementById('outputPowerLevel').style.backgroundColor = "white";
                localStorage.setItem('power', evt.target.value);
            } else {
                document.getElementById('outputPowerLevel').style.backgroundColor = "#ff5976";
            }

		} else {
			var power = 43;
	    	try {
	        	var local = JSON.parse(localStorage.getItem('power'));
	    		if(local) power = local;
	    	} catch (e) {
	    		console.log(e);
	    	} finally {
	    		document.getElementById('outputPowerLevel').value = power;
	    		localStorage.setItem('power', power);
	    	}
		}
    }

	saveDuration(evt) {
		if(evt) {
	        if(evt.target.value < 1) evt.target.value = 1;
	        if(evt.target.value > 600) evt.target.value = 600;
	        localStorage.setItem('duration', evt.target.value);
		} else {
			var duration = 30;
	    	try {
	        	var local = JSON.parse(localStorage.getItem('duration'));
	    		if(local) duration = local;
	    	} catch (e) {
	    		console.log(e);
	    	} finally {
	    		document.getElementById('testDuration').value = duration;
	    		localStorage.setItem('duration', duration);
	    	}
		}
	}
    
}