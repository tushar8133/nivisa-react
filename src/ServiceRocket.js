import io from 'socket.io-client';

export class Rocket {
	constructor() {}

	static fire(cmd, sec) {
		let socket = io("http://localhost:8472");
		var socketObj = {
			address: localStorage.getItem('address'),
			command: cmd
		};

		if(cmd == "FAKE") cmd = '*IDN?';
		if(cmd == "FAKE3") sec = 5000;
		if(JSON.parse(localStorage.getItem('demo'))) sec = 500;

		socket.emit('comm', socketObj);
		
		var p1 = new Promise((resolve, reject) => {
			socket.on('comm', function(resp) {
				resolve(JSON.parse(resp));
			});
			// setTimeout( _ => {
			// 	resolve("mock server response");
			// }, 1000)
		});

		// if(cmd.indexOf('?') > -1) sec = 1000;
		var p2 = new Promise((resolve, reject) => {
			setTimeout( _ => {
				resolve('default delay');
			}, sec);
		});

		return new Promise( (resolve, reject) => {
			Promise.all([p1, p2])
			.then(function(values) {
				resolve(values[0]);
			});
		})
	}
}
