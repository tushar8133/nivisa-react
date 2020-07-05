import React from 'react';
import { Contra } from './ServiceContra';

export class Calibration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (
            <main id='calibration-page'>

                <h2>Caution During calibration, RF power is present, and the red RF On light is illuminated.</h2>

                <p>This calibration is only for the PIM vs TIME Measurement, for all power levels. Please follow below:</p>

                <div id="tab1">
                    <div className="grid">
                        <div>
                            <p>Anritsu PIM Master MW89119B</p>
                            <img src="./assets/step1.png" />
                        </div>
                        <div>
                            <p>LOW PIM TERMINATION 2000-1749-R</p>
                            <img src="./assets/step2.png" />
                        </div>
                        <div>
                            <p>Please connect LOW PIM TERMINATION onto PIM MASTER TEST PORT</p>
                            <img src="./assets/step3.png" />
                        </div>
                    </div>

                    <div className="calibration-step1">
                        <button onClick={ _ => {this.resetCalibration()} }>RESET<br />Calibration</button>
                        <button onClick={ _ => {this.readyCalibrationProcess()} }>INITIATE<br />Calibration</button>
                    </div>
                </div>

                <div id="tab2">
                    <div className="grid-part2">
                        <div className="hide"></div>
                        <div>
                            <p>Please ensure LOW PIM TERMINATION is connected onto PIM Test Port.<br />To continue press ENTER or ESCAPE to exit.</p>
                            <img src="./assets/step4.png" />
                        </div>
                        <div className="hide"></div>
                    </div>

                    <div className="calibration-step2">
                        <button onClick={ this.toggleTab }>ESCAPE</button>
                        <button onClick={ _ => {this.calibrate()} }>ENTER</button>
                    </div>
                </div>
                
            </main>
        )
    }

    toggleTab() {
        var tab1Status = document.getElementById("tab1").style.display || "block";
        document.getElementById("tab2").style.display = tab1Status;
        document.getElementById("tab1").style.display = (tab1Status == "block")? "none" : "block";
    }

    sendCommand(cmd) {
        Contra.start([cmd]).then(data => {
            this.setResponse(data[0]);
        });
    }

    setResponse(resp) {}

    readyCalibrationProcess() {
        Contra.start([':PIManalyzer:MODe?']).then(currentMode => {
            if(currentMode == "PIM") {
                this.toggleTab();
            } else {
                Contra.start([':PIManalyzer:MODe PIM']).then( _ => {
                    this.toggleTab();
                })
            }
        });
    }

    calibrate() {
        Contra.start([':INITiate:PIManalyzer:PVT:ALLPower:CAL', 'WAIT', ':INITiate:PIManalyzer:RESidual:CAL']).then(data => {
            this.toggleTab();
        });
    }

    resetCalibration() {
        Contra.start([':CALibration:PIManalyzer:FULL OFF']).then(data => {
            
        });
    }
}