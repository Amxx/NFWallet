pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/Upgradeability/InitializableUpgradeabilityProxy.sol";
import "./IReceiver.sol";

contract CounterfactualTokenProxy is InitializableUpgradeabilityProxy, IReceiver
{
	receive()
	external payable override
	{
		emit Received(msg.sender, msg.value);
	}
}
