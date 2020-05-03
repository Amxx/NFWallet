pragma solidity ^0.6.0;

contract Transfer
{
	function transfer(address payable to)
	external payable
	{
		to.transfer(msg.value);
	}
}
