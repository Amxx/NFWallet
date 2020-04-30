import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';

import ERC20           from '../../../abi/ERC20.json';
import LendingPool     from '../../../abi/LendingPool.json';
import LendingPoolCore from '../../../abi/LendingPoolCore.json';


const WithBalance = (props) =>
{
	const [ balances, setBalances ] = React.useState(null);

	React.useEffect(() => {
		const fetchBalances = () =>
		{
			Promise.all(
				Object.values(props.services.config.exchange.tokens)
				.map(async (token) => {
					let reserveData;
					try
					{
						const reserve  = token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address;

						const pool     = new ethers.Contract(    LendingPool.networks[props.services.network.chainId].address,     LendingPool.abi, props.services.provider.getSigner());
						const poolcore = new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner());
						const address  = await poolcore.getReserveATokenAddress(reserve);
						const data     = await pool.getUserReserveData(reserve, props.data.wallet.id);

						console.log(token.symbol, data)

						reserveData = {
							aTokenAddress: address,
							aTokenBalance: data.currentATokenBalance / 10 ** token.decimals,
							borrowBalance: data.currentBorrowBalance / 10 ** token.decimals,
							// data.principalBorrowBalance,
							// data.borrowRateMode,
							// data.borrowRate,
							// data.liquidityRate,
							// data.originationFee,
							// data.variableBorrowIndex,
							// data.lastUpdateTimestamp,
							// data.usageAsCollateralEnabled,
						};
					}
					catch
					{
						reserveData = null
					}
					finally
					{
						if (token.isEth)
						{
							return { ...token, reserveData, balance: props.data.wallet.balance / 10 ** token.decimals };
						}
						else
						{
							const contract = new ethers.Contract(token.address, ERC20.abi, props.services.provider.getSigner());
							const amount   = await contract.balanceOf(props.data.wallet.id);
							return { ...token, reserveData, balance: amount / 10 ** token.decimals };
						}
					}
				})
			).then(tokens => setBalances(
				tokens
					.sort((t1, t2) => !t1.isEth && (t2.isEth || t1.balance < t2.balance)) // with ether, then by balance
					.reduce((acc, token) => ({ ...acc, [token.symbol]: token }), {})
			))
		}
		// trigger and subscribe
		fetchBalances()
		const subscription = props.services.emitter.addListener('tx', fetchBalances);
		return () => subscription.remove();
	}, [props]);

	return <>
		{  balances && React.Children.map(props.children, child => React.cloneElement(child, { balances })) }
		{ !balances && <div className='d-flex justify-content-center'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div> }
	</>;
}

export default WithBalance;
