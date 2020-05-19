import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { ethers  } from 'ethers';

// NFWallet
import NFWallet           from '../../../abi/NFWallet.json';
// ERC20
import ERC20              from '../../../abi/ERC20.json';
// AAVE
import LendingPool        from '../../../abi/LendingPool.json';
import IPriceOracleGetter from '../../../abi/IPriceOracleGetter.json';
// Compound
import CEther             from '../../../abi/CEther.json';
import CToken             from '../../../abi/CToken.json';
import Comptroller        from '../../../abi/Comptroller.json';
import PriceOracle        from '../../../abi/PriceOracle.json';


const WithDetails = (props) =>
{
	const [ AAVEpool            ] = React.useState(       LendingPool.networks[props.services.network.chainId] && new ethers.Contract(       LendingPool.networks[props.services.network.chainId].address,        LendingPool.abi, props.services.provider));
	const [ AAVEpriceoracle     ] = React.useState(IPriceOracleGetter.networks[props.services.network.chainId] && new ethers.Contract(IPriceOracleGetter.networks[props.services.network.chainId].address, IPriceOracleGetter.abi, props.services.provider));
	const [ Cpriceoracle        ] = React.useState(       PriceOracle.networks[props.services.network.chainId] && new ethers.Contract(       PriceOracle.networks[props.services.network.chainId].address,        PriceOracle.abi, props.services.provider));
	const [ Ccomptroller        ] = React.useState(       Comptroller.networks[props.services.network.chainId] && new ethers.Contract(       Comptroller.networks[props.services.network.chainId].address,        Comptroller.abi, props.services.provider));

	const [ account, setAccount ] = React.useState(null);
	const [ tokens,  setTokens  ] = React.useState(null);

	// React.useEffect(() => { console.info('update account', account) }, [account]);
	// React.useEffect(() => { console.info('update tokens',  tokens ) }, [tokens ]);

	React.useEffect(() => {
		const fetchDetails = () =>
		{
			console.log('refresh details...');


			(new Promise(async (resolve, reject) => {
				let extraData = {};

				extraData.registry = await (new ethers.Contract(props.data.wallet.id, NFWallet.abi, props.services.provider)).registry();

				// AAVE account details
				try
				{
					const data = await AAVEpool.getUserAccountData(props.data.wallet.id);
					extraData.aave = {
						totalLiquidityETH:           data.totalLiquidityETH,
						totalCollateralETH:          data.totalCollateralETH,
						totalBorrowsETH:             data.totalBorrowsETH,
						totalFeesETH:                data.totalFeesETH,
						availableBorrowsETH:         data.availableBorrowsETH,
						currentLiquidationThreshold: data.currentLiquidationThreshold,
						ltv:                         data.ltv,
						healthFactor:                data.healthFactor,
					}
				}
				catch {};

				// Compound account details
				try
				{
					const [
						[, accountLiquidity, shortfall],
						assetsIn,
					] = await Promise.all([
						Ccomptroller.getAccountLiquidity(props.data.wallet.id),
						Ccomptroller.getAssetsIn(props.data.wallet.id),
					]);

					extraData.compound = {
						accountLiquidity,
						shortfall,
						assetsIn,
					}
				}
				catch {};

				resolve({
					...extraData,
					address: props.data.wallet.id,
					owner:   props.data.wallet.owner.id,
					isOwner: props.data.wallet.owner.id === props.services.accounts[0].toLowerCase(),
				});
			}))
			.then(setAccount);

			// tokens data
			Promise.all(
				Object.values(props.services.config.assets.tokens)
				.map(async (token) => {
					let extraData = {};

					// AAVE token data
					try
					{
						const reserve = token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address;
						const [
							reservedata,
							userreservedata,
							assetPrice
						] = await Promise.all([
							AAVEpool.getReserveData(reserve),
							AAVEpool.getUserReserveData(reserve, props.data.wallet.id),
							AAVEpriceoracle.getAssetPrice(reserve),
						]);

						extraData.aave = {
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
					catch {};

					// Compound token data
					try
					{
						const ctoken   = props.services.config.assets.compound[token.symbol];
						const contract = new ethers.Contract(ctoken, (token.isEth ? CEther : CToken).abi, props.services.provider);
						const [
							underlying,
							cTokenDecimals,
							[, cTokenBalance, borrowBalance, exchangeRateStored],
							availableLiquidity,
							borrowRatePerBlock,
							assetPrice,
						] = await Promise.all([
							!token.isEth && contract.underlying(),
							contract.decimals(),
							contract.getAccountSnapshot(props.data.wallet.id),
							contract.getCash(),
							contract.borrowRatePerBlock(),
							Cpriceoracle.getUnderlyingPrice(ctoken),
						]);

						extraData.compound = (token.isEth || (token.address === underlying)) &&
						{
							cTokenAddress: ctoken,
							cTokenDecimals,
							cTokenBalance,
							borrowBalance,
							exchangeRateStored,
							availableLiquidity,
							borrowRatePerBlock,
							assetPrice,
						};
					}
					catch{};

					if (token.isEth)
					{
						return {
							...token,
							...extraData,
							balance: ethers.utils.bigNumberify(props.data.wallet.balance),
							uniswap: props.services.config.assets.uniswap && props.services.config.assets.uniswap[token.symbol],
							pToken:  props.services.config.assets.pToken  && props.services.config.assets.pToken[token.symbol],
						};
					}
					else
					{
						const contract = new ethers.Contract(token.address, ERC20.abi, props.services.provider);
						const balance  = await contract.balanceOf(props.data.wallet.id);
						return {
							...token,
							...extraData,
							balance,
							uniswap: props.services.config.assets.uniswap && props.services.config.assets.uniswap[token.symbol],
							pToken:  props.services.config.assets.pToken  && props.services.config.assets.pToken[token.symbol],
						};
					}
				})
			).then(tokens => setTokens(
				tokens
					.sort((t1, t2) => !t1.isEth && (t2.isEth || t1.symbol > t2.symbol)) // with ether, then by balance
					.reduce((acc, token) => ({ ...acc, [token.symbol]: token }), {})
			));

		}
		// trigger and subscribe
		fetchDetails()
		const subscription = props.services.emitter.addListener('tx', fetchDetails);
		return () => subscription.remove();
	}, [
		props,
		props.data.wallet.events,
		AAVEpool,
		AAVEpriceoracle,
		Ccomptroller,
		Cpriceoracle,
	]);

	return <>
		{
			account && tokens
			? React.Children.map(props.children, child => React.cloneElement(child, { details: { account, tokens} }))
			: <div className='container my-auto text-center'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div>
		}
	</>;
}

export default WithDetails;
