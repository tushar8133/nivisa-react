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
        this.init();
        this.getDBCutoff();
    }

    render() {
        return (
            <main id='pim-page'>

            <div className="grid">
                <fieldset>
                    <legend>Test Setting</legend>
                    <div><label>Pass/Fail Value (dBc)<input type="number" id="dbcutoff" onInput={this.saveDBCutoff} /></label></div>
                    <div><label>Output Power (dBm)<input type="number" id="outputPowerLevel" onInput={this.savePower} onBlur={ this.setPower.bind(this) } /></label></div>
                    <div><label>Test Duration (sec)<input type="number" id="testDuration" onInput={this.saveDuration} onBlur={ this.setDuration.bind(this) } /></label></div>
                </fieldset>

                <fieldset>
                    <legend>IMD</legend>
                    <button className="btnOrder" onClick={ _ => {this.getIMDOrder(3, _.target)} }>IMD Order 3</button>
                    <button className="btnOrder" onClick={ _ => {this.getIMDOrder(5, _.target)} }>IMD Order 5</button>
                    <button className="btnOrder" onClick={ _ => {this.getIMDOrder(7, _.target)} }>IMD Order 7</button>
                    {
                    (this.state.f1 || this.state.f2) && (
                    <fieldset className="orderFreq" >
                        <legend>Frequency</legend>
                        <div>F1 Tone: {this.state.f1 + " MHz"}</div>
                        <div>F2 Tone: {this.state.f2 + " MHz"}</div>
                    </fieldset>)
                    }
                </fieldset>

                <fieldset>
                    <legend>Measurement</legend>
                    <button id="elem_PIM" onClick={ _ => {this.setMeasurementMode(_.target.id)} }>PIM Vs Time</button>
                    <button id="elem_SPECTRUM_VIEW" onClick={ _ => {this.setMeasurementMode(_.target.id)} }>Noise Floor</button>
                    <button id="elem_DTP" onClick={ _ => {this.setMeasurementMode(_.target.id)} }>Distance to PIM</button>
                    <button id="elem_PIMSwp" onClick={ _ => {this.setMeasurementMode(_.target.id)} }>Swept PIM</button>
                </fieldset>

                <span></span>
                <span></span>

                <fieldset>
                    <legend>System Preset</legend>
                    <button className="systemPreset" onClick={ _ => {this.systemPreset()} }>Preset</button>
                </fieldset>
            </div>

	            <br />
                <span className="spacer" />
            </main>
        )
    }

    getIMDOrder(val, elem) {
        this.highlightIMDOrder(elem)
        Contra.start([':PIManalyzer:IMD:ORDer '+val,':PIManalyzer:FREQuency:F1?',':PIManalyzer:FREQuency:F2?'])
        .then( data => {
            try {
                this.setState(prevState => ({
                    f1: data[1].substr(0, 4),
                    f2: data[2].substr(0, 4)
                }));
            } catch(e) {
                console.log(e)
            }
        })
    }

    highlightIMDOrder(elem) {
        let elemArr = document.querySelectorAll('.btnOrder');
        elemArr.forEach( curr => {
            curr.classList.remove("active_measurement");
        });
        elem.classList.add("active_measurement");
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
        if(localStorage.getItem('dbcutoff') === null) {
            localStorage.setItem('dbcutoff', "-100");
        }
        document.getElementById('dbcutoff').value = localStorage.getItem('dbcutoff');
    }

    saveDBCutoff(evt) {
        localStorage.setItem('dbcutoff', evt.target.value);
    }

    savePower(evt) {
		if(evt.target.value >= 20 && evt.target.value <= 46) {
            document.getElementById('outputPowerLevel').style.backgroundColor = "white";
            localStorage.setItem('power', evt.target.value);
        } else {
            document.getElementById('outputPowerLevel').style.backgroundColor = "#ff5976";
        }
    }

	saveDuration(evt) {
		if(evt.target.value < 1) evt.target.value = 1;
        if(evt.target.value > 600) evt.target.value = 600;
        localStorage.setItem('duration', evt.target.value);
	}

	init() {
		Contra.start([':PIManalyzer:OUTPut:POWer?', ':PIManalyzer:TEST:DURation?',':PIManalyzer:MODe?'])
		.then( data => {
			this.getPowerAndDuration(data[0], data[1]);
	        this.checkCurrentMeasurementMode("elem_"+data[2]);
		})
		
	}

	getPowerAndDuration(_power, _duration) {
	    try {
	    	var power = parseInt(_power);
	    	var duration = parseInt(_duration);
	        localStorage.setItem("power", power );
	        localStorage.setItem("duration", duration );
	        document.getElementById('outputPowerLevel').value = power;
	        document.getElementById('testDuration').value = duration;
	    } catch(e) {
	        console.log(e)
	    }

	}

	checkCurrentMeasurementMode(elemMode) {
	    let elemArr = ["elem_PIM","elem_SPECTRUM_VIEW","elem_DTP","elem_PIMSwp"];
    	elemArr.forEach( elem => {
    		document.getElementById(elem).classList.remove("active_measurement");
    	});
    	document.getElementById(elemMode).classList.add("active_measurement");
	}

	setMeasurementMode(id) {
		switch(id) {
			case "elem_PIM" : this.checkCurrentMeasurementMode(id); this.pimvstimeHandler(); break;
			case "elem_SPECTRUM_VIEW" : this.checkCurrentMeasurementMode(id); this.noiseFloor(); break;
			case "elem_DTP" : this.checkCurrentMeasurementMode(id); this.dtpHandler(); break;
			case "elem_PIMSwp" : this.checkCurrentMeasurementMode(id); this.sweptpimHandler(); break;
		}
	}

    systemPreset() {
        Contra.start([':SYSTem:PRESet'])
        .then( data => {
            alert("Preset done!");
        })
    }
    
}