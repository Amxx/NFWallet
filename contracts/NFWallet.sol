pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./core/CounterfactualTokenEntity.sol";

struct Call
{
	address to;
	uint256 value;
	bytes   data;
}

contract NFWallet is CounterfactualTokenEntity, IERC721Receiver
{
	event Received(address indexed from, uint256 value);

	// Asset receiving
	receive()
	external payable
	{
		emit Received(_msgSender(), msg.value);
	}

	function onERC721Received(address, address, uint256, bytes memory)
	public override returns (bytes4)
	{
		return this.onERC721Received.selector;
	}

	// Wallet
	function forward(address to, uint256 value, bytes calldata data)
	external onlyOwner()
	{
		_execute(to, value, data);
	}

	function forwardBatch(Call[] calldata calls)
	external onlyOwner()
	{
		for (uint256 i = 0; i < calls.length; ++i)
		{
			_execute(calls[i].to, calls[i].value, calls[i].data);
		}
	}

	function _execute(address to, uint256 value, bytes memory data)
	internal
	{
		(bool success, bytes memory returndata) = payable(to).call{value: value}(data);
		require(success, string(returndata));
	}
}
