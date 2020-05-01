import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput    from '../UI/BalanceInput';

import { ethers }        from 'ethers';
import * as utils        from '../../libs/utils'

import ERC20             from '../../abi/ERC20.json';
import UniswapV2Router01 from '../../abi/UniswapV2Router01.json';


const WalletUniswapV2 = (props) =>
{
	const [ router                  ] = React.useState(new ethers.Contract(UniswapV2Router01.networks[props.services.network.chainId].address, UniswapV2Router01.abi, props.services.provider.getSigner()));
	const [ swappable               ] = React.useState(Object.values(props.details.tokens).filter(({UniswapV2}) => UniswapV2));

	const [ base,      setBase      ] = React.useState('ETH');
	const [ quote,     setQuote     ] = React.useState(swappable.find(({symbol}) => symbol !== 'ETH').symbol);
	const [ amount,    setAmount    ] = React.useState({});
	const [ estimated, setEstimated ] = React.useState(ethers.constants.Zero);
	const [ uniparams, setUniparams ] = React.useState({});
	const [ enough,    setEnough    ] = React.useState(true);

	React.useEffect(() => {
		if (base === quote)
		{
			setQuote(swappable.find(({symbol}) => symbol !== base).symbol);
		}
	}, [base])

	// Uniswap params hook - on base, quote, value change
	React.useEffect(() => {
		if (base !== quote)
		{
			try
			{
				const from   = props.details.tokens[base];
				const to     = props.details.tokens[quote];
				const method = from.isEth ? 'swapExactETHForTokens' : to.isEth ? 'swapExactTokensForETH' : 'swapExactTokensForTokens';
				const path   = [
					from.address,
					!from.isEth && !to.isEth ? props.details.tokens['ETH'].address : undefined, // weth
					to.address,
				].filter(Boolean);

				setUniparams({ from, to, method, path });
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
	}, [uniparams, base, quote, amount]);

	// Execute hook
	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		utils.executeTransactions(
			props.data.wallet.id,
			[
				// approve if source is an erc20
				!uniparams.from.isEth &&
				[
					uniparams.from.address,
					'0',
					(new ethers.utils.Interface(ERC20.abi)).functions['approve'].encode([ router.address, amount.value ])
				],
				// call UniswapV2Router
				[
					router.address,
					uniparams.from.isEth ? amount.value : 0,
					router.interface.functions[uniparams.method].encode([
						!uniparams.from.isEth ? amount.value : undefined,
						'0',
						uniparams.path,
						props.data.wallet.id,
						ethers.constants.MaxUint256,
					].filter(Boolean))
				]
			],
			props.services
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column align-items-stretch ${props.className}`}>
			<BalanceInput
				label         = 'Send'
				className     = 'my-1'
				token         = { base }
				tokenSelector = { swappable.filter(({isEth, balance}) => isEth || balance.gt(0)) }
				tokenDecimals = { props.details.tokens[base].decimals }
				tokenBalance  = { props.details.tokens[base].balance }
				callbacks     = {{ setToken: setBase, setAmount, setEnough }}
			/>
			<BalanceInput
				label         = 'Receive'
				className     = 'my-1'
				value         = { estimated }
				token         = { quote }
				tokenSelector = { swappable.filter(({symbol}) => symbol !== base) }
				tokenDecimals = { props.details.tokens[quote].decimals }
				callbacks     = {{ setToken: setQuote }}
				disabled
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Exchange {base} → {quote} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletUniswapV2;
