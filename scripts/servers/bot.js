/** @param {NS} ns **/
export async function main(ns) {
	var i = 0
	var ram = ns.args[0]
	while (i < 25) {
		if (ns.getServerMoneyAvailable("home") * 0.25 > ns.getPurchasedServerCost(ram)) {
			var hostname = ns.purchaseServer("pserv-"+i, ram);
			++i;
		}
		await ns.sleep(1000 * 60);
	}
}