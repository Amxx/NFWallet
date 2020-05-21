pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
import "./IReceiver.sol";


abstract contract CounterfactualTokenEntity is Context, IReceiver
{
	IERC721 public registry;

	function initialize(address _registry)
	public virtual
	{
		require(address(registry) == address(0), 'already initialized');
		registry = IERC721(_registry);

		if (address(this).balance > 0)
		{
			emit Received(address(0), address(this).balance);
		}
	}

	function owner()
	public view returns (address)
	{
		return registry.ownerOf(uint256(address(this)));
	}

	modifier onlyOwner()
	{
		require(owner() == _msgSender(), 'caller is not authorized');
		_;
	}

	modifier onlyOwnerOrRegistry()
	{
		require(owner() == _msgSender() || address(registry) == _msgSender(), 'caller is not authorized');
		_;
	}
}
