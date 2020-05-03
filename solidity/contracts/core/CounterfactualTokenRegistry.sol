pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./CounterfactualTokenProxy.sol";

abstract contract CounterfactualTokenRegistry is ERC721, Ownable
{
	address public master;
	bytes   public proxyCode;
	bytes32 public proxyCodeHash;

	constructor(address _master, string memory _name, string memory _symbol)
	public ERC721(_name, _symbol)
	{
		master        = _master;
		proxyCode     = type(CounterfactualTokenProxy).creationCode;
		proxyCodeHash = keccak256(proxyCode);
	}

	/* Factory */
	function _mintCreate(address _owner, bytes memory _args)
	internal returns (uint256)
	{
		// Create entry (proxy)
		address entry = Create2.deploy(0, keccak256(abi.encodePacked(_args, _owner)), proxyCode);
		// Initialize entry
		CounterfactualTokenProxy(payable(entry)).initialize(master, _args);
		// Mint corresponding token
		_mint(_owner, uint256(entry));
		return uint256(entry);
	}

	function _mintPredict(address _owner, bytes memory _args)
	internal view returns (uint256)
	{
		address entry = Create2.computeAddress(keccak256(abi.encodePacked(_args, _owner)), proxyCodeHash);
		return uint256(entry);
	}
}
