import io from 'socket.io-client';
import { Galaxy } from './ServiceGalaxy';
import { Rocket } from './ServiceRocket';
import { Trailblazer } from './ServiceTrailblazer';

export class Contra {

	constructor(){}

	static async start(cmds) {
		let galaxy = new Galaxy();
		galaxy.progressBarStart();

		let final = [];
		var trailblazer = new Trailblazer(cmds);
		for (var i = 0; i < trailblazer.eachCmd.length; i++) {
			galaxy.progressBarMsgs(trailblazer.eachMsgs[i]);
			galaxy.progressBarMove(trailblazer.eachDuration, i);
			var currentCmdResult = await Rocket.fire(trailblazer.eachCmd[i], trailblazer.eachDuration[i]);
			final.push(currentCmdResult);
			galaxy.progressBarReset();
		}

		galaxy.progressBarReset();
		galaxy.progressBarStop();
		return final;
	}

}

