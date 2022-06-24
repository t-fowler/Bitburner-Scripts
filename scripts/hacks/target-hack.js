/** @param {NS} ns **/

export async function main(ns) {
	// Parameters: target name and thresholds for target wealth and security levels,
	// below which we will not hack.
	let target = ns.args[0];
	let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
	let securityThresh = ns.getServerMinSecurityLevel(target) + 5;

	/*
	if (ns.fileExists("Formulas.exe", "home")) {
		
	}
	*/
	// Refresh log file.
	await ns.write("/logs/target-hack.txt", "", "w");
	if (!ns.hasRootAccess(target)) {
		let openPorts = 0;
		if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(target); openPorts++; }  // Open SSH port.
		if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(target); openPorts++; }  // Open FTP port.
		if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(target); openPorts++; }  // Open SMTP port.
		if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(target); openPorts++; }  // Open HTTP port.
		if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(target); openPorts++; }  // Open SQL port.
		if (ns.getServerNumPortsRequired(target) <= openPorts) { ns.nuke(target); }  // Get root access to target server.
		else {
			await ns.write("/logs/target-hack.txt",
				target + " cannot be hacked: not enough open ports.", "a");
			return;
		}
	}

	// Infinite loop that continuously hacks/grows/weakens the target server.
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}