import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput    from '../../../UI/BalanceInput';

import { ethers }        from 'ethers';
import * as utils        from '../../../../libs/utils'

import ERC20             from '../../../../abi/ERC20.json';
import UniswapV2Router01 from '../../../../abi/UniswapV2Router01.json';


const WalletUniswapV2 = (props) =>
{
	const [ router                  ] = React.useState(new ethers.Contract(UniswapV2Router01.networks[props.services.network.chainId].address, UniswapV2Router01.abi, props.services.provider.getSigner()));
	const [ swappable               ] = React.useState(Object.values(props.details.tokens).filter(({UniswapV2}) => UniswapV2));

	const [ base,      setBase      ] = React.useState(props.details.tokens['ETH']);
	const [ quote,     setQuote     ] = React.useState(swappable.find(({symbol}) => symbol !== 'ETH'));
	const [ amount,    setAmount    ] = React.useState({});
	const [ estimated, setEstimated ] = React.useState(ethers.constants.Zero);
	const [ uniparams, setUniparams ] = React.useState({});
	const [ enough,    setEnough    ] = React.useState(true);

	React.useEffect(() => {
		if (base === quote)
		{
			setQuote(swappable.find(token => token !== base));
		}
	}, [swappable, base, quote])

	// Uniswap params hook - on base, quote, value change
	React.useEffect(() => {
		if (base !== quote)
		{
			try
			{
				const method = base.isEth ? 'swapExactETHForTokens' : quote.isEth ? 'swapExactTokensForETH' : 'swapExactTokensForTokens';
				const path   = [
					base.address,
					!base.isEth && !quote.isEth && props.details.tokens['ETH'].address, // weth
					quote.address,
				].filter(Boolean);

				setUniparams({ method, path });
			}
			catch (err)
			{
				setUniparams({});
			}
		}
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

	// Execute hook
	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

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
		<form onSubmit={handleSubmit} className={`d-flex flex-column align-items-stretch ${props.className}`}>
			<BalanceInput
				label         = 'Send'
				className     = 'my-1'
				tokenSymbol   = { base.symbol }
				tokenSelector = { swappable.filter(({isEth, balance}) => isEth || balance.gt(0)) }
				tokenDecimals = { base.decimals }
				tokenBalance  = { base.balance }
				callbacks     = {{ setToken: (symbol) => setBase(props.details.tokens[symbol]), setAmount, setEnough }}
			/>
			<BalanceInput
				label         = 'Receive'
				className     = 'my-1'
				value         = { estimated }
				tokenSymbol   = { quote.symbol }
				tokenSelector = { swappable.filter(({symbol}) => symbol !== base) }
				tokenDecimals = { quote.decimals }
				callbacks     = {{ setToken: (symbol) => setQuote(props.details.tokens[symbol]) }}
				disabled
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner}>
				Exchange {base.symbol} → {quote.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
			</MDBBtn>
		</form>
	);
}

export default WalletUniswapV2;
