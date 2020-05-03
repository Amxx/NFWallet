var Transfer = artifacts.require("Transfer");

module.exports = function(deployer, network, accounts) {
	if (network === 'development')
	{
		deployer.deploy(Transfer);
	}
};
