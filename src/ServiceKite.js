import io from 'socket.io-client';

export function Kite(cmd) {
	let socket = io("http://localhost:8472");
	var socketObj = {
		address: localStorage.getItem('address'),
		command: cmd
	};
	socket.emit('comm', socketObj);
}