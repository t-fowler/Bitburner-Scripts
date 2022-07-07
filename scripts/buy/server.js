/** @param {NS} ns */
import {waitForMoney} from "/lib/util.js";

export async function main(ns) {
	let exp = 20;
	if (ns.args.length > 0) {
		exp = ns.args[0];
	}

	let pservers = ns.getPurchasedServers().length;
	let serverCost = ns.getPurchasedServerCost(2 ** exp) * 1.1;

	while (pservers < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") 
		   > serverCost) {
			   ns.purchaseServer("pserver-" + pservers++, 2 ** exp);
		} else {
			await waitForMoney(ns, serverCost);
		}
	}
}