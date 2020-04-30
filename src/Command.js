import React from 'react';
import connectMachine from './service';

class Command extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (
            <main id='calibration-page'>

                <h2>Caution During calibration, RF power is present, and the red RF On light is illuminated.</h2>

                <p>Please use MW82119B PIM Master unit and follow the below steps as described for the standard calibration process.</p>

                <div className="grid">
                    <div>
                        <p>STEP 1</p>
                        <ol>
                            <li>Press Shift then Cal (2) to open the Calibration menu.</li>
                            <li>In the Calibration menu, press the Start Calibration submenu key</li>
                            <li>Connect a PIM standard onto the test port of the PIM Master or at the end of the PIM test cable.</li>
                            <li>Connect a Low PIM Termination onto the PIM standard and Hit the Enter on instrument</li>
                        </ol>
                        <img src="/step1.jpg" />
                    </div>
                    <div>
                        <p>STEP 2</p>
                        <ol>
                            <li>When prompted, remove the PIM standard and the Low PIM Termination.</li>
                            <li>Connect only the Low PIM Termination. and Hit the Enter on Instrument.</li>
                        </ol>
                        <span>
                            <img src="/step2.jpg" />
                        </span>
                    </div>
                    <div>
                        <p>STEP 3</p>
                        <ol>
                            <li>When prompted, remove all components from the test port leaving nothing connected at the point of calibration (Open circuit) and Hit the Enter on Instrument</li>
                        </ol>
                        <img src="/step3.jpg" />
                    </div>
                </div>
                
            </main>
        )
    }

    sendCommand(cmd, sec, msg) {
        connectMachine(cmd, sec, msg).then( data => {
            this.setResponse(data);
        });
    }
}

export default Command;
