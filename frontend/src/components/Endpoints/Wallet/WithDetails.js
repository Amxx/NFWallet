import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';

import ERC20              from '../../../abi/ERC20.json';
import LendingPool        from '../../../abi/LendingPool.json';
import IPriceOracleGetter from '../../../abi/IPriceOracleGetter.json';


const WithDetails = (props) =>
{
	const [ pool                ] = React.useState(LendingPool.networks[props.services.network.chainId]        && new ethers.Contract(       LendingPool.networks[props.services.network.chainId].address,        LendingPool.abi, props.services.provider.getSigner()));
	const [ priceoracle         ] = React.useState(IPriceOracleGetter.networks[props.services.network.chainId] && new ethers.Contract(IPriceOracleGetter.networks[props.services.network.chainId].address, IPriceOracleGetter.abi, props.services.provider.getSigner()));

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
					withAAVE:                    true,
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
						const reserve = token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address;

						const [
							reservedata,
							userreservedata,
							assetPrice
						] = await Promise.all([
							pool.getReserveData(reserve),
							pool.getUserReserveData(reserve, props.data.wallet.id),
							priceoracle.getAssetPrice(reserve),
						]);

						reserveData = {
							assetPrice,
							reserveAddress:           reserve,
							totalLiquidity:           reservedata.totalLiquidity,
							availableLiquidity:       reservedata.availableLiquidity,
							totalBorrowsFixed:        reservedata.totalBorrowsFixed,
							totalBorrowsVariable:     reservedata.totalBorrowsVariable,
							liquidityRate:            reservedata.liquidityRate,
							variableBorrowRate:       reservedata.variableBorrowRate,
							fixedBorrowRate:          reservedata.fixedBorrowRate,
							averageFixedBorrowRate:   reservedata.averageFixedBorrowRate,
							utilizationRate:          reservedata.utilizationRate,
							liquidityIndexRate:       reservedata.liquidityIndexRate,
							variableBorrowIndex:      reservedata.variableBorrowIndex,
							aTokenAddress:            reservedata.aTokenAddress,
							aTokenBalance:            userreservedata.currentATokenBalance,
							borrowBalance:            userreservedata.currentBorrowBalance,
							principalBorrowBalance:   userreservedata.principalBorrowBalance,
							borrowRateMode:           userreservedata.borrowRateMode,
							borrowRate:               userreservedata.borrowRate,
							// liquidityRate:            userreservedata.liquidityRate,
							originationFee:           userreservedata.originationFee,
							// variableBorrowIndex:      userreservedata.variableBorrowIndex,
							usageAsCollateralEnabled: userreservedata.usageAsCollateralEnabled,
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
	}, [props, pool, priceoracle]);

	return <>
		{
			account && tokens
			? React.Children.map(props.children, child => React.cloneElement(child, { details: { account, tokens} }))
			: <div className='d-flex justify-content-center'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div>
		}
	</>;
}

export default WithDetails;
