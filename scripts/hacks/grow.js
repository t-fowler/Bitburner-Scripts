/** @param {NS} ns */
export async function main(ns) {
	await ns.grow(ns.getHostname());
}