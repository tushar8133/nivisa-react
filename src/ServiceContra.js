import io from 'socket.io-client';
import { Galaxy } from './ServiceGalaxy';
import { Rocket } from './ServiceRocket';
import { Trailblazer } from './ServiceTrailblazer';

export class Contra {

	constructor(){}

	static async start(cmds) {
		Galaxy.progressBarStart();
		
		document.getElementById("rfAbort").onclick = function() {
			Galaxy.progressBarStop();
		}

		let final = [];
		var trailblazer = new Trailblazer(cmds);
		for (var i = 0; i < trailblazer.eachCmd.length; i++) {
			Contra.progressBarMsgsHandler(trailblazer.eachMsgs[i]);
			Galaxy.progressBarMove(trailblazer.eachDuration, i);
			var currentCmdResult = await Rocket.fire(trailblazer.eachCmd[i], trailblazer.eachDuration[i]);
			final.push(currentCmdResult);
			Galaxy.progressBarReset();
		}

		Galaxy.progressBarReset();
		Galaxy.progressBarStop();
		return final;
	}

	static progressBarMsgsHandler(msg) {
		Galaxy.progressBarMsg(msg);
	}

}

