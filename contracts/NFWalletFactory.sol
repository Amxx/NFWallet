pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/ENStools/ENSReverseRegistration.sol";
import "./core/CounterfactualTokenRegistry.sol";
import "./NFWallet.sol";


contract NFWalletFactory is CounterfactualTokenRegistry, ENSReverseRegistration
{
	constructor()
	public CounterfactualTokenRegistry(
		address(new NFWallet()),
		'NonFungibleWallet',
		'NFW')
	{
	}

	function encodeInitializer(bytes32 _salt)
	internal view returns (bytes memory)
	{
		return abi.encodeWithSignature('initialize(address)', address(this), _salt);
	}

	function createWallet(address _owner, bytes32 _salt)
	external returns (address)
	{
		return address(_mintCreate(_owner, encodeInitializer(_salt)));
	}

	function predictWallet(address _owner, bytes32 _salt)
	external view returns (address)
	{
		return address(_mintPredict(_owner, encodeInitializer(_salt)));
	}

	function setName(address _ens, string calldata _name)
	external onlyOwner()
	{
		_setName(ENS(_ens), _name);
	}
}
