import io from 'socket.io-client';

export class Rocket {
	constructor() {}

	static fire(cmd, sec) {
		if(cmd == ":PIManalyzer:OUTPut:POWer") cmd += " "+localStorage.getItem('power');
		if(cmd == ":PIManalyzer:TEST:DURation") cmd += " "+localStorage.getItem('duration');
		if(JSON.parse(localStorage.getItem('demo'))) sec = 500;
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
		for (var i = 0; i < 10; i++) {
			result = await Rocket.ignite(cmd);
			if(result) break;
			await Rocket.pause(1000);
		}
		return result;
	}

	static async checkRFstatus(cmd) {
		for (var i = 0; i < 10; i++) {
			let result = await Rocket.ignite(cmd);
			if(result == "0") break;
			await Rocket.pause(1000);
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
