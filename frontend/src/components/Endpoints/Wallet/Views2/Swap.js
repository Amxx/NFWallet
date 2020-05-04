import * as React from 'react';
import { MDBBtn, MDBIcon } from 'mdbreact';

import Paper     from '@material-ui/core/Paper';
import Grid      from '@material-ui/core/Grid';
import SwapToken from './SwapToken';

import { ethers }        from 'ethers';
import * as utils        from '../../../../libs/utils'
import ERC20             from '../../../../abi/ERC20.json';
import UniswapV2Router01 from '../../../../abi/UniswapV2Router01.json';


const Swap = (props) =>
{
	const [ router                  ] = React.useState(new ethers.Contract(UniswapV2Router01.networks[props.services.network.chainId].address, UniswapV2Router01.abi, props.services.provider.getSigner()));
	const [ tokens                  ] = React.useState(Object.values(props.details.tokens).filter(({UniswapV2}) => UniswapV2));
	const [ base,      setBase      ] = React.useState(props.details.tokens['ETH']);
	const [ quote,     setQuote     ] = React.useState(tokens.find(({symbol}) => symbol !== 'ETH'));
	const [ amount,    setAmount    ] = React.useState({});
	const [ enough,    setEnough    ] = React.useState(true);
	const [ estimated, setEstimated ] = React.useState(ethers.constants.Zero);
	const [ uniparams, setUniparams ] = React.useState({});

	const invert = () => { setBase(quote); setQuote(base); }
	const updateBase  = (newBase ) => { (newBase === quote) ? invert() : setBase(newBase)   }
	const updateQuote = (newQuote) => { (newQuote === base) ? invert() : setQuote(newQuote) }

	// Update uniswap params
	React.useEffect(() => {
		setUniparams({
			method: base.isEth ? 'swapExactETHForTokens' : quote.isEth ? 'swapExactTokensForETH' : 'swapExactTokensForTokens',
			path:   [ base.address, !base.isEth && !quote.isEth && props.details.tokens['ETH'].address, quote.address ].filter(Boolean),
		});
	}, [props, base, quote]);

	// Predict outcome hook - on base, quote, value change
	React.useEffect(() => {
		try
		{
			router.getAmountsOut(amount.value, uniparams.path)
			.then(values => setEstimated(values[values.length-1]))
			.catch(err => setEstimated(ethers.constants.Zero))
		}
		catch
		{
			setEstimated(ethers.constants.Zero);
		}
	}, [router, uniparams, base, quote, amount]);

	const handleSwap = () =>
	{
		if (amount.value.eq(0)) { return; }

		utils.executeTransactions(
			props.details.account.address,
			[
				// approve if source is an erc20
				!base.isEth &&
				{
					address:  base.address,
					artefact: ERC20,
					method:   'approve',
					args:     [ router.address, amount.value ],
				},
				// call UniswapV2Router
				{
					address:  router.address,
					value:    base.isEth && amount.value,
					artefact: UniswapV2Router01,
					method:   uniparams.method,
					args:
					[
						!base.isEth ? amount.value : undefined,
						ethers.constants.Zero,
						uniparams.path,
						props.details.account.address,
						ethers.constants.MaxUint256,
					].filter(Boolean)
				},
			],
			props.services
		);
	}

	return (
		<Grid container direction='row' justify='center' alignItems='stretch' className='h-100 p-2'>

			<Grid item xs={12} sm={11} md={10} lg={9} xl={8} container direction='column' justify='center' alignItems='center'>
				<Grid item container direction='row' justify='center' alignItems='center' style={{width: '100%'}}>

					<Grid item xs={5}>
						<SwapToken
							title     = 'Token to Sell'
							token     = {base}
							tokenList = {tokens}
							onChange  = {updateBase}
							setAmount = {setAmount}
							setEnough = {setEnough}
						/>
					</Grid>

					<Grid item xs={1} className='text-center'>
						<a href='#!' onClick={invert}><MDBIcon icon="exchange-alt" /></a>
					</Grid>

					<Grid item xs={5}>
						<SwapToken
							title     = 'Token to Buy'
							token     = {quote}
							tokenList = {tokens}
							onChange  = {updateQuote}
							value     = {estimated}
							disabled
						/>
					</Grid>

				</Grid>
				<MDBBtn color='elegant' onClick={handleSwap} className='mt-4' disabled={!enough || !props.details.account.isOwner}>
					Send
				</MDBBtn>
			</Grid>

		</Grid>
	);

	// return (
	// 	<Grid container direction='row' justify='center' alignItems='stretch' className='h-100 p-2'>
	//
	// 		<Grid item xs={5} sm={5} md={4} lg={3} container direction='column' justify='space-evenly' alignItems='center'>
	// 			<Grid item className='w-100'>
	// 				<SwapToken
	// 					title     = 'Token to Sell'
	// 					token     = {base}
	// 					tokenList = {tokens}
	// 					onChange  = {updateBase}
	// 					setAmount = {setAmount}
	// 					setEnough = {setEnough}
	// 				/>
	// 			</Grid>
	// 		</Grid>
	//
	// 		<Grid item xs={2} container direction='column' justify='space-evenly' alignItems='center'>
	// 			<Grid item style={{visibility: 'hidden'}}>
	// 				<MDBBtn color='elegant' onClick={handleSwap} disabled={!enough || !props.details.account.isOwner}>Swap</MDBBtn>
	// 			</Grid>
	// 			<Grid item>
	// 				<a href='#!' onClick={invert}><MDBIcon icon="exchange-alt" /></a>
	// 			</Grid>
	// 			<Grid item>
	// 				<MDBBtn color='elegant' onClick={handleSwap} disabled={!enough || !props.details.account.isOwner}>Swap</MDBBtn>
	// 			</Grid>
	// 		</Grid>
	//
	// 		<Grid item xs={5} sm={5} md={4} lg={3} container direction='column' justify='space-evenly' alignItems='center'>
	// 			<Grid item className='w-100'>
	// 				<SwapToken
	// 					title     = 'Token to Buy'
	// 					token     = {quote}
	// 					tokenList = {tokens}
	// 					onChange  = {updateQuote}
	// 					value     = {estimated}
	// 					disabled
	// 				/>
	// 			</Grid>
	// 		</Grid>
	//
	// 	</Grid>
	// );
}

export default Swap;
