import io from 'socket.io-client';
import { LEGO } from './ServiceLego';

export class Trailblazer {

	constructor(cmds){
		let selectedCmdsRawData = this.processSelectiveCmdsData(cmds);
		let {eachDuration, eachMsgs, eachCmd} = this.processEachData(selectedCmdsRawData);
		this.eachDuration = eachDuration;
		this.eachMsgs = eachMsgs;
		this.eachCmd = eachCmd;
		this.totalDuration = this.processTotalDuration(eachDuration);
	}

	processSelectiveCmdsData(cmdNamesOnly) {
		let data = [];
		cmdNamesOnly.forEach( outerCmd => {
			LEGO.forEach( innerCmd => {
				if(outerCmd.indexOf(innerCmd.id) > -1) {
					innerCmd.id = outerCmd;
					data.push(innerCmd);
				}
			})
		})
		return data;
	}
	
	processEachData(selectiveCmdsRawData) {
		let data = { eachDuration: [], eachMsgs: [], eachCmd: [] };
		selectiveCmdsRawData.forEach( obj => {
			let sec = obj.delay;
			if(sec == '-1') sec = localStorage.getItem('duration');
			sec = Number(sec) * 1000;
			data.eachDuration.push(sec);
			data.eachMsgs.push(obj.desc);
			data.eachCmd.push(obj.id);
		})
		return data;
	}

	processTotalDuration(eachDurationArray) {
		let total = eachDurationArray.reduce( (total, curr) => {
			return total += curr;
		})
		return total;
	}

}
