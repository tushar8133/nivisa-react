import io from 'socket.io-client';

var socket = io("http://localhost:8472");
var timer = null;

export default function connectMachine(cmd, sec = 3000) {

	progressBar(sec);

	document.getElementById('spinner2').style.display = 'block';
	var socketObj = {
		address: localStorage.getItem('address'),
		command: cmd
	};

	console.log(socketObj)

	socket.emit('comm', socketObj);
	
	var p1 = new Promise((resolve, reject) => {
		socket.on('comm', function(resp) {
			resolve(JSON.parse(resp));
		});
	});

	var p2 = new Promise((resolve, reject) => {
		setTimeout( _ => {
			resolve(['mock','service']);
		}, sec);
	});

	return new Promise( (resolve, reject) => {
		Promise.all([p1, p2])
		.then(function(values) {
			if(timer) clearInterval(timer);
			document.getElementById('spinner2').style.display = 'none';
			resolve(values[0]);
		});
	})


}

function progressBar(sec) {
	var bar = document.getElementById("progressbar");
	bar.style.display = 'block';
	var start = new Date().getTime();
	var end = start + sec;
	var counter = 0;
	bar.style.width = '0px';
	timer = setInterval( _ => {
		var remaining = (new Date().getTime()) - end;
		var current = (remaining + sec);
		var val2 = current * (100 / sec);
		bar.style.width = (val2 - 5) +'%'
	}, 10)
};