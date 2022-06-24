/** @param {NS} ns **/
export async function main(ns) {
	var servers = ns.scan(ns.getHostname());
	var depth = ns.args[0];
	var transfered = [];

	for (let d = 0; d <= depth; d++) {
		var nextLevel = [];
		for (let i = 0; i < servers.length; i++) {
			var neighbours = ns.scan(servers[i]);
			for (let j = 0; j < neighbours.length; j++) {
				if (transfered.indexOf(neighbours[j]) < 0) {
					ns.tprint("New neighbour!" + neighbours[j]);
					nextLevel.push(neighbours[j]);
				}
			}
			await ns.scp("/scripts/hacks/weaken.script", servers[i])
			await ns.scp("/scripts/hacks/grow.script", servers[i]);
			await ns.scp("/scripts/hacks/hack.script", servers[i]);
			await ns.scp("/scripts/hacks/target-hack.js", servers[i]);
			transfered.push(servers[i]);
		}
		servers = nextLevel.slice();
	}
	
	for (let i = 0; i < transfered.length; i++) {
		ns.tprint(transfered[i]);
	}
}