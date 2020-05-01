import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';

import ERC20           from '../../../abi/ERC20.json';
import LendingPool     from '../../../abi/LendingPool.json';
import LendingPoolCore from '../../../abi/LendingPoolCore.json';


const WithDetails = (props) =>
{
	const pool     =     LendingPool.networks[props.services.network.chainId] && new ethers.Contract(    LendingPool.networks[props.services.network.chainId].address,     LendingPool.abi, props.services.provider.getSigner());
	const poolcore = LendingPoolCore.networks[props.services.network.chainId] && new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner());

	const [ account, setAccount ] = React.useState(null);
	const [ tokens,  setTokens  ] = React.useState(null);

	// React.useEffect(() => { console.info('update account', account) }, [account]);
	// React.useEffect(() => { console.info('update tokens',  tokens ) }, [tokens ]);

	React.useEffect(() => {
		const fetchBalances = () =>
		{
			// user account data
			if (pool)
			{
				pool.getUserAccountData(props.data.wallet.id)
				.then(data => setAccount({
					address:                     props.data.wallet.id,
					totalLiquidityETH:           data.totalLiquidityETH,
					totalCollateralETH:          data.totalCollateralETH,
					totalBorrowsETH:             data.totalBorrowsETH,
					totalFeesETH:                data.totalFeesETH,
					availableBorrowsETH:         data.availableBorrowsETH,
					currentLiquidationThreshold: data.currentLiquidationThreshold,
					ltv:                         data.ltv,
					healthFactor:                data.healthFactor,
				}))
				.catch(() => setAccount({ address: props.data.wallet.id }));
			}
			else
			{
				setAccount({ address: props.data.wallet.id });
			}

			// tokens data
			Promise.all(
				Object.values(props.services.config.exchange.tokens)
				.map(async (token) => {
					let reserveData;
					try
					{
						const reserve  = token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address;
						const address  = await poolcore.getReserveATokenAddress(reserve);
						const data     = await pool.getUserReserveData(reserve, props.data.wallet.id);

						reserveData = {
							reserveAddress:           reserve,
							aTokenAddress:            address,
							aTokenBalance:            data.currentATokenBalance,
							borrowBalance:            data.currentBorrowBalance,
							principalBorrowBalance:   data.principalBorrowBalance,
							borrowRateMode:           data.borrowRateMode,
							borrowRate:               data.borrowRate,
							liquidityRate:            data.liquidityRate,
							originationFee:           data.originationFee,
							variableBorrowIndex:      data.variableBorrowIndex,
							lastUpdateTimestamp:      data.lastUpdateTimestamp,
							usageAsCollateralEnabled: data.usageAsCollateralEnabled,
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
							return { ...token, reserveData, balance: ethers.utils.bigNumberify(props.data.wallet.balance) };
						}
						else
						{
							const contract = new ethers.Contract(token.address, ERC20.abi, props.services.provider.getSigner());
							const balance  = await contract.balanceOf(props.data.wallet.id);
							return { ...token, reserveData, balance };
						}
					}
				})
			).then(tokens => setTokens(
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
		{
			account && tokens
			? React.Children.map(props.children, child => React.cloneElement(child, { details: { account, tokens} }))
			: <div className='d-flex justify-content-center'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div>
		}
	</>;
}

export default WithDetails;
