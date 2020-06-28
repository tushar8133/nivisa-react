import io from 'socket.io-client';
import { Rocket } from './ServiceRocket';

export class Galaxy {

	constructor(){
		this.timer = null;
	}

	static progressBarMove(eachDuration, round) {
		var roundDuration = eachDuration[round];
		var totalDuration = eachDuration.reduce( (total, curr) => total += curr);
		var pastDuration = ( (past,all,round) => { all.forEach( (val,index) => {if(round > index) past += val}); return past; })(0, eachDuration, round);
		
		var bar = document.getElementById("progressbar");
		var finish = Date.now() + roundDuration;
		this.timer = setInterval( _ => {
			var current = Date.now();
			var remaining = finish - current;
			var currProgress = (100 - (remaining/roundDuration) * 100).toFixed(2);
			var pastBar = (pastDuration/totalDuration * 100).toFixed(2);
			var currBar = (roundDuration/totalDuration * currProgress).toFixed(2);
			var final = Number(pastBar) + Number(currBar);
			if(currProgress > 100) {
				this.progressBarReset();
			}else {
				bar.style.width = final + '%';
			}
		}, 100);
	}

	static progressBarMsg(msg) {
		var loader = document.getElementById("loading-text");
		loader.innerHTML = msg;
	}

	static progressBarCounter(count) {
		document.getElementById("loading-counter").innerHTML = count;
	}

	static progressBarStart() {
		document.getElementById("progressbar").style.width = '0px'
		document.getElementById('loader').style.display = 'block';
	}

	static progressBarStop() {
		document.getElementById("progressbar").style.width = '0px'
		document.getElementById('loader').style.display = 'none';
	}

	static progressBarReset() {
		window.clearInterval(this.timer);
	}

}