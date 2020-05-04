import io from 'socket.io-client';
import {cmdNames} from './Service-cmd';

var socket = io("http://localhost:8472");
var timer = null;

export function flyingKite(cmd) {
	var socketObj = {
		address: localStorage.getItem('address'),
		command: cmd
	};
	console.log('remote', socketObj)
	socket.emit('comm', socketObj);
}


export function connectMachine(cmd) {

	var sec = 0;
	var msg = '';
	cmdNames.forEach( (obj) => {
		if(cmd.indexOf(obj.id) > -1) {
			sec = obj.delay;
			msg = obj.desc;
		}
	})

	if(sec == '-1') sec = localStorage.getItem('duration');
	sec = Number(sec) * 1000;

	if(JSON.parse(localStorage.getItem("demo"))) sec = 0;
	if(timer) return;

	progressBar(msg, sec);

	if(cmd == "FAKE") cmd = '*IDN?';

	document.getElementById('loader').style.display = 'block';
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
			document.getElementById('loader').style.display = 'none';
			timer = null;
			resolve(values[0]);
		});
	})

}

function progressBar(msg, sec) {
	if(timer) return;
	document.getElementById("loading-text").innerHTML = msg;
	var bar = document.getElementById("progressbar");
	bar.style.width = '0px';
	var start = new Date().getTime();
	var end = start + sec;
	var counter = 0;
	bar.style.width = '0px';
	timer = setInterval( _ => {
		var remaining = (new Date().getTime()) - end;
		var current = (remaining + sec);
		var val2 = current * (100 / sec);
		bar.style.width = (val2 - 5) +'%'
		if(val2 > 100) {
			bar.style.width = '0px';
			clearInterval(timer);
		}
	}, 10)
};