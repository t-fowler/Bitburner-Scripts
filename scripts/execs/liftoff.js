/** @param {NS} ns **/
function getServerList(ns) {
	let servers = [ns.getHostname()];
	let scanned = [];
	while (true) {
		let search = servers.filter(x => !scanned.includes(x));
		if (!search.length) {
			return servers;
		}
		for (let i = 0; i < search.length; i++) {
			servers = [
				...servers, 
				...ns.scan(search[i])
					.filter(x => !servers.includes(x))
					];
			scanned.push(search[i]);
		}
	}
}

export async function main(ns) {
	// accessible servers
	function cmpRam(s1, s2) {
		let r1 = ns.getServerMaxRam(s1);
		let r2 = ns.getServerMaxRam(s2);
		return r1 - r2;
	}

	function cmpHackLevel(s1, s2) {
		let r1 = ns.getServerRequiredHackingLevel(s1);
		let r2 = ns.getServerRequiredHackingLevel(s2);
		return r1 - r2;
	}

	let owned = ["home", ...ns.getPurchasedServers()];
	let targets = getServerList(ns).filter(x => (ns.hasRootAccess(x) && ns.getServerRequiredHackingLevel(x) <= ns.getHackingLevel() && !owned.includes(x)))
				.sort(cmpHackLevel).reverse();
	let servers = getServerList(ns).sort(cmpRam).reverse();
	ns.tprint(owned);
	ns.tprint(targets);
	ns.tprint(servers);

	for (let i = 0; i < servers.length; i++) {
		let host = servers[i];
		let maxRam = ns.getServerMaxRam(host);
		let numThreads = maxRam / 3;
		let target = targets[i%targets.length];

		// Open SSH port.
		if (!ns.hasRootAccess(host)) {
			let openPorts = 0;
			if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(host); openPorts++; }  // Open SSH port.
			if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(host); openPorts++; }  // Open FTP port.
			if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(host); openPorts++; }  // Open SMTP port.
			if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(host); openPorts++; }  // Open HTTP port.
			if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(host); openPorts++; }  // Open SQL port.
			if (ns.getServerNumPortsRequired(host) <= openPorts) { ns.nuke(host); }  // Get root access to target server.
			else { continue; }
		}

		// Execute hack script.
		if (numThreads > 0) {
			ns.exec("/scripts/hacks/target-hack.js", host, numThreads, target);
		}
	}
}