pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/ENStools/ENSReverseRegistration.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./core/CounterfactualTokenRegistry.sol";
import "./NFWallet.sol";


contract NFWalletFactory is
	CounterfactualTokenRegistry,
	BaseRelayRecipient,
	ENSReverseRegistration
{
	constructor()
	public CounterfactualTokenRegistry(
		address(new NFWallet()),
		'NonFungibleWallet',
		'NFW')
	{
	}

	function initialize(address _trustedForwarder)
	public onlyOwner()
	{
		require(trustedForwarder == address(0), 'already initialized');
		trustedForwarder = _trustedForwarder;
	}

	function _msgSender()
	internal view override(Context, BaseRelayRecipient) returns (address payable sender)
	{
		return BaseRelayRecipient._msgSender();
	}

	function encodeInitializer(bytes32 _salt)
	internal view returns (bytes memory)
	{
		return abi.encodeWithSignature('initialize(address,address)', address(this), trustedForwarder, _salt);
	}

	function createWallet(address _owner, bytes32 _salt)
	external payable returns (address)
	{
		address wallet = address(_mintCreate(_owner, encodeInitializer(_salt)));
		if (msg.value > 0)
		{
			(bool success, bytes memory returndata) = payable(wallet).call{value: msg.value}('');
			require(success, string(returndata));
		}
		return wallet;
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
