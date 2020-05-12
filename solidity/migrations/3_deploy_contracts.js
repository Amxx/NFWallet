// Factory
var GenericFactory  = artifacts.require('@iexec/solidity/GenericFactory')
var NFWalletFactory = artifacts.require('NFWalletFactory')

const LIBRARIES = [
].map(contract => ({
	pattern: new RegExp(`__${contract.contractName}${'_'.repeat(38-contract.contractName.length)}`, 'g'),
	library: contract,
}))

/*****************************************************************************
 *                                   Tools                                   *
 *****************************************************************************/
function getSerializedObject(entry)
{
	return (entry.type == 'tuple')
		? `(${entry.components.map(getSerializedObject).join(',')})`
		: entry.type;
}

function getFunctionSignatures(abi)
{
	return [
		...abi
			.filter(entry => entry.type == 'receive')
			.map(entry => 'receive;'),
		...abi
			.filter(entry => entry.type == 'fallback')
			.map(entry => 'fallback;'),
		...abi
			.filter(entry => entry.type == 'function')
			.map(entry => `${entry.name}(${entry.inputs.map(getSerializedObject).join(',')});`),
	].filter(Boolean).join('');
}

async function factoryDeployer(contract, options = {})
{
	console.log(`[factoryDeployer] ${contract.contractName}`);
	const factory          = await GenericFactory.deployed();
	const libraryAddresses = await Promise.all(LIBRARIES.filter(({ pattern }) => contract.bytecode.search(pattern) != -1).map(async ({ pattern, library }) => ({ pattern, ...await library.deployed() })));
	const constructorABI   = contract._json.abi.find(e => e.type == 'constructor');
	const coreCode         = libraryAddresses.reduce((code, { pattern, address }) => code.replace(pattern, address.slice(2).toLowerCase()), contract.bytecode);
	const argsCode         = constructorABI ? web3.eth.abi.encodeParameters(constructorABI.inputs.map(e => e.type), options.args || []).slice(2) : '';
	const code             = coreCode + argsCode;
	const salt             = options.salt  || '0x0000000000000000000000000000000000000000000000000000000000000000';

	contract.address = options.call
		? await factory.predictAddressWithCall(code, salt, options.call)
		: await factory.predictAddress(code, salt);

	if (await web3.eth.getCode(contract.address) == '0x')
	{
		console.log(`[factory] Preparing to deploy ${contract.contractName} ...`);
		options.call
			? await factory.createContractAndCall(code, salt, options.call)
			: await factory.createContract(code, salt);
		console.log(`[factory] ${contract.contractName} successfully deployed at ${contract.address}`);
	}
	else
	{
		console.log(`[factory] ${contract.contractName} already deployed`);
	}
}

/*****************************************************************************
 *                                   Main                                    *
 *****************************************************************************/
module.exports = async function(deployer, network, accounts)
{
	console.log('# web3 version:', web3.version);
	const chainid   = await web3.eth.net.getId();
	const chaintype = await web3.eth.net.getNetworkType();
	console.log('Chainid is:', chainid);
	console.log('Chaintype is:', chaintype);
	console.log('Deployer is:', accounts[0]);

	const factoryOptions = { salt: process.env.SALT || web3.utils.randomHex(32) };

	await factoryDeployer(NFWalletFactory, { call: web3.eth.abi.encodeFunctionCall(NFWalletFactory._json.abi.find(e => e.name == 'transferOwnership'), [ accounts[0] ]), ...factoryOptions });

	const NFWalletFactoryInstance = await NFWalletFactory.deployed();
	switch (network)
	{
		// case 'mainnet': case 'mainnet-fork': await NFWalletFactoryInstance.initialize('0x0000000000000000000000000000000000000000'); break;
		case 'ropsten': case 'ropsten-fork': await NFWalletFactoryInstance.initialize('0xcC87aa60a6457D9606995C4E7E9c38A2b627Da88'); break;
		// case 'rinkeby': case 'rinkeby-fork': await NFWalletFactoryInstance.initialize('0x0000000000000000000000000000000000000000'); break;
		// case 'goerli':  case 'goerli-fork':  await NFWalletFactoryInstance.initialize('0x0000000000000000000000000000000000000000'); break;
		case 'kovan':   case 'kovan-fork':   await NFWalletFactoryInstance.initialize('0x6453D37248Ab2C16eBd1A8f782a2CBC65860E60B'); break;
		default: break;
	}
};
