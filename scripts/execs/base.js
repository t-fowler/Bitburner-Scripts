/** @param {NS} ns */
import * as util from "/lib/util.js";
import * as xpl from "/lib/exploit.js";

export async function main(ns) {
	let owned_hosts = util.owned(ns);
	let targets = util.scanHosts(ns).filter(
		function (host) {
			return !owned_hosts.includes(host) 
				&& ns.getServerMaxMoney(host) > 0
				&& ns.getServerNumPortsRequired(host) <= xpl.exploitsAvailable(ns).length
	});
	
	targets.forEach(function (host) {
		xpl.exploitHost(ns, host);
	});

	let i = -1;
	let j = 0;
	while (true) {
		await ns.sleep(100);
		i++;
		i %= owned_hosts.length;
		let host = owned_hosts[i];

		targets.forEach( function (target) {
			let freeRam = 0;
			if (host === "home") {
				freeRam = freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - 100;
			}
			else {
				freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - 1;
			}
			let maxThreads = Math.max(parseInt(ns.getServerMaxRam(host) 
						   / ns.getScriptRam("/scripts/hacks/remote_hack.js") 
						   / targets.length), 1);
			if (freeRam < (maxThreads * ns.getScriptRam("scripts/hacks/remote_hack.js"))) {
				return;
			}
			let securityThreshold = ns.getServerMinSecurityLevel(target) * 1.1;
			let moneyThreshold = ns.getServerMaxMoney(target) * 0.9;

			if (ns.getServerSecurityLevel(target) > securityThreshold) {
				ns.exec("/scripts/hacks/remote_weaken.js", host, maxThreads, target);
			} else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
				ns.exec("/scripts/hacks/remote_grow.js", host, maxThreads, target);
			} else {
				ns.exec("/scripts/hacks/remote_hack.js", host, maxThreads, target);
			}
		});
	}
}