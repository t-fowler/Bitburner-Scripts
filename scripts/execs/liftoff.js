/** @param {NS} ns */
import * as util from "/lib/util.js";
import * as xpl from "/lib/exploit.js";

export async function main(ns) {
	let hosts = util.scanHosts(ns);
	for (let host of hosts) {
		xpl.exploitHost(ns, host);
		await xpl.exfiltrateData(ns, host);
	}

	let i = -1;
	while (true) {
		await ns.sleep(100);
		i++;
		i %= hosts.length;
		let host = hosts[i];
		let freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - 1;
		
		if (!ns.hasRootAccess(host) || freeRam < ns.getScriptRam("/scripts/hacks/hack.js"))
			continue;

		let maxThreads = Math.max(1, parseInt(freeRam / ns.getScriptRam("/scripts/hacks/hack.js")));
		let securityThreshold = ns.getServerMinSecurityLevel(host) * 1.1;
		let moneyThreshold = ns.getServerMaxMoney(host) * 0.9;

		if (ns.getServerSecurityLevel(host) > securityThreshold) {
			ns.exec("/scripts/hacks/weaken.js", host, maxThreads);
		} else if (ns.getServerMoneyAvailable(host) < moneyThreshold) {
			ns.exec("/scripts/hacks/grow.js", host, maxThreads);
		} else {
			ns.exec("/scripts/hacks/hack.js", host, maxThreads);
		}
	}
}