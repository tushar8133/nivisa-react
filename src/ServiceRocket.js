import io from 'socket.io-client';
import { Galaxy } from './ServiceGalaxy';

let RETRY_TIMES = 10;
let RETRY_PAUSE = 1000;
let RETRY_COUNT = 0;

export class Rocket {
	constructor() {}

	static fire(cmd, sec) {
		if(cmd == ":PIManalyzer:OUTPut:POWer") cmd += " "+localStorage.getItem('power');
		if(cmd == ":PIManalyzer:TEST:DURation") cmd += " "+localStorage.getItem('duration');
		if(cmd == "INITiate:PIManalyzer:MEASure ON") sec += 2500;

		if(JSON.parse(localStorage.getItem('demo'))) {
			sec = 1000;
			RETRY_TIMES = 1;
			RETRY_PAUSE = 500;
		}
		RETRY_COUNT = 0;
		Rocket.retryCounterHandler();

		let p1 = Rocket.defaultTimer(cmd, sec);
		let p2 = null;

		if(cmd == ':PIManalyzer:MEASure:STATus?') {
			p2 = Rocket.checkRFstatus(cmd);
		}
		else if(cmd.slice(-1) == '?') {
			p2 = Rocket.spark(cmd);
		}
		else {
			p2 = Rocket.launch(cmd);
		}

		return new Promise( (resolve, reject) => {
			Promise.all([p1, p2])
			.then(function(values) {
				resolve(values[1]);
			});
		})
	}

	static ignite(cmd) {
		let socket = io("http://localhost:8472");
		let socketObj = {
			address: localStorage.getItem('address'),
			command: cmd
		};
		socket.emit('comm', socketObj);
		return new Promise((resolve, reject) => {
			socket.on('comm', function(resp) {
				resolve(JSON.parse(resp));
			});

			socket.on('ERROR', function(resp) {
				if(resp.indexOf("CONNECTION_NOT_FOUND") > -1) {
					Galaxy.showErrorWindow(resp, "Please check connection and restart application");
				} else {
					Galaxy.showErrorWindow(resp, "Error - Reloading application in few seconds...");
					setTimeout( _ => {
						window.location.reload();
					}, 5000);
				}
			});
		});
	}

	static async launch(cmd) {
		return await Rocket.ignite(cmd);
	}

	static async spark(cmd) {
		let result = null;
		for (var i = 0; i < RETRY_TIMES; i++) {
			Rocket.retryCounterHandler()
			result = await Rocket.ignite(cmd);
			if(result != "" && result != "0.0, 0.0") break;
			await Rocket.pause(RETRY_PAUSE);
		}
		return result;
	}

	static async checkRFstatus(cmd) {
		for (var i = 0; i < RETRY_TIMES; i++) {
			Rocket.retryCounterHandler()
			let result = await Rocket.ignite(cmd);
			if(result == "0") break;
			await Rocket.pause(RETRY_PAUSE);
		}
		return true;
	}

	static defaultTimer(cmd, sec) {
		if(cmd.slice(-1) == '?') sec = 0;
		return new Promise((resolve, reject) => {
			setTimeout( _ => {
				resolve(true);
			}, sec);
		});
	}

	static pause(sec) {
		return new Promise( (resolve, reject) => {
			setTimeout( _ => {
				resolve();
			}, sec)
		})
	}

	static retryCounterHandler() {
		let text = (RETRY_COUNT)? RETRY_COUNT : "";
		Galaxy.progressBarCounter(text);
		RETRY_COUNT++;
	}

}
