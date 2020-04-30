import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import TextField       from '@material-ui/core/TextField';
import InputAdornment  from '@material-ui/core/InputAdornment';

import { ethers }        from 'ethers';
import * as utils        from '../../libs/utils'

import ERC20             from '../../abi/ERC20.json';
import UniswapV2Router01 from '../../abi/UniswapV2Router01.json';


const WalletUniswapV2 = (props) =>
{
	const router = new ethers.Contract(UniswapV2Router01.networks[props.services.network.chainId].address, UniswapV2Router01.abi, props.services.provider.getSigner());

	const [ base,      setBase      ] = React.useState(ethers.constants.EtherSymbol);
	const [ quote,     setQuote     ] = React.useState('DAI');
	const [ amount,    setAmount    ] = React.useState('');
	const [ uniparams, setUniparams ] = React.useState({});
	const [ estimated, setEstimated ] = React.useState(0);
	const [ enough,    setEnough    ] = React.useState(true);

	React.useEffect(() => {
		if (base === quote)
		{
			setQuote(
				Object.values(props.balances)
				.find(({symbol, UniswapV2}) => symbol !== base && UniswapV2)
				.symbol
			);
		}
	}, [base])

	// Uniswap params hook - on base, quote, value change
	React.useEffect(() => {
		try
		{
			const from   = props.balances[base];
			const to     = props.balances[quote];
			const method = from.isEth ? 'swapExactETHForTokens' : to.isEth ? 'swapExactTokensForETH' : 'swapExactTokensForTokens';
			const path   = [
				from.address,
				!from.isEth && !to.isEth ? props.balances[ethers.constants.EtherSymbol].address : undefined, // weth
				to.address,
			].filter(Boolean);

			setUniparams({ from, to, method, path });
		}
		catch
		{
			setUniparams({});
		}
	}, [props, base, quote]);

	// Predict outcome hook - on base, quote, value change
	React.useEffect(() => {
		try
		{
			router.getAmountsOut(amount.value, uniparams.path)
			.then(values => setEstimated(Number(values[values.length-1]) / 10 ** uniparams.to.decimals))
			.catch(() => setEstimated(0))
		}
		catch
		{
			setEstimated(0);
		}
	}, [router, uniparams, base, quote, amount]);

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
				balances   = { props.balances }
				filter     = { ({UniswapV2, isEth, balance}) => UniswapV2 && (isEth || balance > 0) }
				callbacks  = {{ setToken: setBase, setAmount, setEnough }}
			/>
			<TextField
				disabled
				label      = 'Receive'
				value      = {estimated}
				variant    = 'outlined'
				className  = 'my-1'
				InputProps = {{
					startAdornment:
						<InputAdornment position='start'>
							<select value={quote} onChange={(e) => setQuote(e.target.value)} style={{ 'width':'100px' }}>
								{
									Object.values(props.balances)
										.filter(({symbol, UniswapV2}) => symbol !== base && UniswapV2)
										.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
								}
							</select>
						</InputAdornment>,
				}}
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Exchange { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletUniswapV2;
