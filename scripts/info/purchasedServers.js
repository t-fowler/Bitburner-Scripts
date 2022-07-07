/** @param {NS} ns */
export async function main(ns) {
	let exp = 20;
	if (ns.args.length > 0) {
		exp = ns.args[0];
	}

	ns.tprintf("%v servers owned.\n", ns.getPurchasedServers().length);
	ns.tprintf("Each server costs $%vb.\n", ns.getPurchasedServerCost(2 ** exp) / 1000000000);
	ns.tprintf("Money available: $%vb", ns.getServerMoneyAvailable("home") / 1000000000);
}