import io from 'socket.io-client';

export class Rocket {
	constructor() {}

	static fire(cmd, sec) {
		if(cmd == "WAIT") cmd = '*IDN?';
		if(JSON.parse(localStorage.getItem('demo'))) sec = 500;
		let returnExpected  = (cmd.slice(-1) == '?')? true : false;
		let defaulttimer = returnExpected? 0 : sec;
		let p1 = defaultTimer(defaulttimer);
		let p2 = spark(cmd, returnExpected);
		return new Promise( (resolve, reject) => {
			Promise.all([p1, p2])
			.then(function(values) {
				resolve(values[1]);
			});
		})
	}
}

function defaultTimer(sec) {
	return new Promise((resolve, reject) => {
		setTimeout( _ => {
			resolve(true);
		}, sec);
	});
}

async function spark(cmd, returnExpected) {
	let retryCount = 0;
	let retryLimit = 3;
	let finalData = "";

	if(returnExpected) {
		while(retryCount < retryLimit) {
			let result = await ignite(cmd);
			if(result) {
				finalData = result;
				break;
			} else {
				retryCount++;
			}
		}
	} else {
		finalData = await ignite(cmd);
	}

	return finalData;
}

function ignite(cmd) {
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

