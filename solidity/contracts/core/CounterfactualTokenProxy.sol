pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/Upgradeability/InitializableUpgradeabilityProxy.sol";


contract CounterfactualTokenProxy is InitializableUpgradeabilityProxy
{
	event Received(address indexed from, uint256 value);

	receive()
	external payable override
	{
		emit Received(msg.sender, msg.value);
	}
}
