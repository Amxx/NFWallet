pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@iexec/solidity/contracts/ERC1271/IERC1271.sol";
import "@iexec/solidity/contracts/ERC1654/IERC1654.sol";
import "@iexec/solidity/contracts/Libs/ECDSA.sol";
import "./core/CounterfactualTokenEntity.sol";

struct Call
{
	address to;
	uint256 value;
	bytes   data;
}

contract NFWallet is CounterfactualTokenEntity, ECDSA, IERC721Receiver, IERC777Recipient, IERC1271, IERC1654
{
	event Received(address indexed from, uint256 value);
	event Executed(address indexed to,   uint256 value, bytes data);

	function onERC721Received(address, address, uint256, bytes memory)
	public override returns (bytes4)
	{
		return this.onERC721Received.selector;
	}

	function tokensReceived(address, address, address, uint256, bytes calldata, bytes calldata)
	public override
	{
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
		emit Executed(to, value, data);
	}

	function isValidSignature(bytes calldata data, bytes calldata signature)
	external view override returns (bytes4 magicValue)
	{
		require(owner() == recover(keccak256(data), signature));
		return IERC1271(0).isValidSignature.selector;
	}

	function isValidSignature(bytes32 hash, bytes calldata signature)
	external view override returns (bytes4 magicValue)
	{
		require(owner() == recover(hash, signature));
		return IERC1654(0).isValidSignature.selector;
	}
}
