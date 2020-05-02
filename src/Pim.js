import React from 'react';
import connectMachine from './service';

class Pim extends React.Component {
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
                    <div><label>Pass/Fail Value (dBm)<input type="number" id="dbcutoff" onInput={this.saveDBCutoff} /></label></div>
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
                {/*<textarea id="textarea"></textarea>*/}
            </main>
        )
    }

    getIMDOrder(val) {
        connectMachine(':PIManalyzer:IMD:ORDer '+val, 'Setting Order '+val, 5000)
        .then( data => {
            return connectMachine(':PIManalyzer:FREQuency:F1?', 'Getting Frequency', 5000)
        })
        .then( data => {
            return connectMachine(':PIManalyzer:FREQuency:F1?', 'Getting F1', 500)
        })
        .then( data => {
            this.setState(prevState => ({
                f1: data.substr(0, 3)
            }));
            return connectMachine(':PIManalyzer:FREQuency:F2?', 'Getting F2', 500)
        })
        .then( data => {
            this.setState(prevState => ({
                f2: data.substr(0, 3)
            }));
        });
    }

    checkCurrentMode() {
        connectMachine(':INSTrument:NSELect?', 'Checking if mode is PIM Analyzer', 1000)
        .then( _ => {
            return connectMachine(':INSTrument:NSELect?', 'Getting Ready', 1000)
        })
        .then( data => {
            if(data != 46) this.changingtopimanalyzerHandler();
        });
    }

    pimvstimeHandler(){
    	connectMachine('SENSe:PIManalyzer:MODe PIM', 'Setting PIM vs Time')
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    setPower() {
        connectMachine(':PIManalyzer:OUTPut:POWer ' + localStorage.getItem('power'), 'Setting Power', 1000)
        .then( data => {
            this.setResponse(data);
        });
    }

    setDuration() {
        connectMachine(':PIManalyzer:TEST:DURation ' + localStorage.getItem('duration'), 'Setting Duration', 1000)
        .then( data => {
            this.setResponse(data);
        });
    }

    sweptpimHandler(){
    	connectMachine(':PIManalyzer:MODe PIMSwp', 'Setting Swept PIM')
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    changingtopimanalyzerHandler() {
        connectMachine(':INSTrument:NSELect 46', 'Changing to PIM Analyzer...', 30000)
        .then( data => {
            this.setResponse(data);
        });
    }

    dtpHandler(){
    	connectMachine(':PIManalyzer:MODe DTP')
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    noiseFloor(){
        connectMachine(':PIManalyzer:MODe SPECTRUM_VIEW')
        .then( data => {
            this.setResponse(data);
        });
    }

    setResponse(resp) {
        console.log(resp)
        // document.getElementById('textarea').value = String(resp);
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

export default Pim;
