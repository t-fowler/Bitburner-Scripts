/** @param {NS} ns **/
function getServerList(ns) {
	let servers = [ns.getHostname()];
	let scanned = [];
	function cmpRam(s1, s2) {
		return (ns.getServerMaxRam(s2) - ns.getServerMaxRam(s1));
	}

	while (true) {
		let search = servers.filter(x => !scanned.includes(x));
		if (!search.length) {
			return servers.sort(cmpRam);
		}
		for (let i = 0; i < search.length; i++) {
			servers = [
				...servers, 
				...ns.scan(search[i]).filter(x => !servers.includes(x))
					];
			scanned.push(search[i]);
		}
	}
}

function updateExes(ns) {
	return ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "SQLInject.exe", "HTTPWorm.exe"]
			.filter(x => ns.fileExists(x, "home"));
}

function hackableServers(ns) {
	let owned = ["home", ...ns.getPurchasedServers()];
	
	function cmpHack(s1, s2) {
		return (ns.getServerMaxMoney(s1) / ns.getServerMinSecurityLevel(s1)
				- ns.getServerMaxMoney(s2) / ns.getServerMinSecurityLevel(s2));
	}

	function accessible(s) {
		return (!owned.includes(s) 
				&& ns.hasRootAccess(s) 
				&& (ns.getServerRequiredHackingLevel(s) < ns.getHackingLevel()));
	}

	return getServerList(ns).filter(accessible).sort(cmpHack);
}

export async function main(ns) {
	let exes = [];
	let owned = ["home", ...ns.getPurchasedServers()];
	let targets = hackableServers(ns);
	let servers = getServerList(ns).filter(x => (ns.hasRootAccess(x)));

	ns.tprintf(".exes %v\n\nowned: %v\n\ntargets %v\n\nservers %v", exes, owned, targets, servers);

	/*while (true) {
		exes = updateExes(ns);

	}*/
}