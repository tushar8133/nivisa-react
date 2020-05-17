import io from 'socket.io-client';

export class Rocket {
	static RETRY_COUNT = 10;
	static RETRY_PAUSE = 1000;
	constructor() {}

	static fire(cmd, sec) {
		if(JSON.parse(localStorage.getItem('demo'))) {
			sec = 500;
			RETRY_COUNT = 1;
			RETRY_PAUSE = 500;
		}

		if(cmd == ":PIManalyzer:OUTPut:POWer") cmd += " "+localStorage.getItem('power');
		if(cmd == ":PIManalyzer:TEST:DURation") cmd += " "+localStorage.getItem('duration');

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
		});
	}

	static async launch(cmd) {
		return await Rocket.ignite(cmd);
	}

	static async spark(cmd) {
		let result = null;
		for (var i = 0; i < RETRY_COUNT; i++) {
			result = await Rocket.ignite(cmd);
			if(result) break;
			await Rocket.pause(RETRY_PAUSE);
		}
		return result;
	}

	static async checkRFstatus(cmd) {
		for (var i = 0; i < RETRY_COUNT; i++) {
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

}
