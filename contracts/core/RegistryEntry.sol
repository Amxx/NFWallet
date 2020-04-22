pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


abstract contract RegistryEntry
{
	IERC721 public registry;

	function _initialize(address _registry)
	internal
	{
		require(address(registry) == address(0), 'already initialized');
		registry = IERC721(_registry);
	}

	function owner()
	public view returns (address)
	{
		return registry.ownerOf(uint256(address(this)));
	}

	modifier onlyOwner()
	{
		require(owner() == msg.sender, 'caller is not the owner');
		_;
	}
}
