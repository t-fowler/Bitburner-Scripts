import {scanHosts, owned} from "lib/util.js";

/** @param {NS} ns */
export async function main(ns) {
	let hosts = scanHosts(ns);
	let files = ns.ls('home').filter(file => file.startsWith('scripts/hacks'));
	hosts = hosts.concat(owned(ns));
	ns.tprint(files);
	ns.tprint(hosts);

	for (let i = 0; i < hosts.length; i++) {
		await ns.scp(files, hosts[i]);
	}
}