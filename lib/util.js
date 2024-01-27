/** @param {NS} ns */

export function scanHosts(ns) {
	let hosts = [];
	let ownedServers = owned(ns);
	let reachable = ns.scan().filter(
		function (host) {
				return !ownedServers.includes(host);
			}
	);
	while (reachable.length != 0) {
		let nextHost = reachable.shift();
		//ns.tprintf("nextHost: %v\n", nextHost);
		let nextLevel = ns.scan(nextHost).filter(
			function (host) {
				return !(hosts.includes(host) || ownedServers.includes(host));
			}
		);
		reachable = reachable.concat(nextLevel);
		//ns.tprintf("nextLevel: %v\n", nextLevel);
		//ns.tprintf("concatenated: %v\n", reachable);
		if (!(hosts.includes(nextHost) || ownedServers.includes(nextHost))) {
			hosts.push(nextHost);
		}
	}
	return hosts;
}

export function owned(ns) {
	let result = ns.scan().filter(
		function (host) {
					return host.slice(0, 7) === "pserver";
		});
	result.push("home");
	return result;
}

export async function waitForMoney(ns, requiredAmount) {
	while (ns.getServerMoneyAvailable("home") < requiredAmount) {
		ns.print("Waiting for $" + requiredAmount);
		await ns.sleep(1000 * 60 * 5);
	}
}