import io from 'socket.io-client';

let retryTimeout = false;

export class Rocket {
	constructor() {}

	static async fire(cmd, sec) {
		let socket = io("http://localhost:8472");
		let retryCount = 0;
		let retryLimit = 3;
		let finalData = "";

		if(cmd == "FAKE") cmd = '*IDN?';
		if(JSON.parse(localStorage.getItem('demo'))) sec = 500;

		if(cmd.indexOf("?") > -1) {
			// retryTimer();
			while(retryCount < retryLimit) {
				let result = await ignite(socket, cmd);
				if(result) {
					finalData = result;
					break;
				} else {
					retryCount++;
				}
			}
		} else {
			finalData = await ignite(socket, cmd);
		}

		return finalData;
	}

}

function ignite(socket, cmd) {
	var socketObj = {
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

function retryTimer() {
	retryTimeout = false;
	setTimeout( _ => {
		retryTimeout = true;
	}, 15000)
}