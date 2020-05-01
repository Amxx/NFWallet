pragma solidity ^0.6.0;


interface IERC20
{
	function totalSupply() external view returns (uint256);
	function balanceOf(address account) external view returns (uint256);
	function transfer(address recipient, uint256 amount) external returns (bool);
	function allowance(address owner, address spender) external view returns (uint256);
	function approve(address spender, uint256 amount) external returns (bool);
	function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface ICEther is IERC20
{
	function redeem(uint redeemTokens) external returns (uint);
	function redeemUnderlying(uint redeemAmount) external returns (uint);
}


contract CEtherRedeamer
{
	ICEther public immutable cether;

	constructor(address _cether)
	public
	{
		cether = ICEther(_cether);
	}

	receive()
	external payable
	{}

	function redeem(uint redeemTokens) external returns (uint)
	{
		uint result = cether.redeem(redeemTokens);
		(bool success, bytes memory returndata) = msg.sender.call{value: address(this).balance}("");
		require(success, string(returndata));
		cether.transfer(msg.sender, cether.balanceOf(address(this)));
		return result;
	}

	function redeemUnderlying(uint redeemAmount) external returns (uint)
	{
		uint result = cether.redeemUnderlying(redeemAmount);
		(bool success, bytes memory returndata) = msg.sender.call{value: address(this).balance}("");
		require(success, string(returndata));
		cether.transfer(msg.sender, cether.balanceOf(address(this)));
		return result;
	}

}
