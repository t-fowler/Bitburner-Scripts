/** @param {NS} ns */
export async function main(ns) {
	await ns.hack(ns.getHostname());
}