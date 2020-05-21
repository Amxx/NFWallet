pragma solidity ^0.6.0;

interface IReceiver
{
	event Received(address indexed from, uint256 value);
}
