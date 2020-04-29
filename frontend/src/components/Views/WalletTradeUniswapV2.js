import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import InputAdornment  from '@material-ui/core/InputAdornment';
import TextField       from '@material-ui/core/TextField';

import { ethers } from 'ethers';
import { abi as ABIERC20             } from '../../abi/ERC20.json';
import { abi as ABIWallet            } from '../../abi/NFWallet.json';
import { abi as ABIUniswapV2Router01 } from '../../abi/UniswapV2Router01.json';


const WalletTradeUniswapV2 = (props) =>
{
	const router = new ethers.Contract(props.services.config.exchange.UniswapV2Router, ABIUniswapV2Router01, props.services.provider.getSigner());
	const wallet = new ethers.Contract(props.data.wallet.id, ABIWallet, props.services.provider.getSigner());

	const [ base,      setBase      ] = React.useState(ethers.constants.EtherSymbol);
	const [ quote,     setQuote     ] = React.useState('DAI');
	const [ value,     setValue     ] = React.useState('');
	const [ uniparams, setUniparams ] = React.useState({});
	const [ estimated, setEstimated ] = React.useState(0);
	const [ enough,    setEnough    ] = React.useState(true);

	const handleBaseChange = (e) =>
	{
		setBase(e.target.value);

		if (e.target.value === quote)
		{
			setQuote(
				Object.values(props.balances)
				.find(({symbol, UniswapV2Pair}) => symbol !== e.target.value && (symbol === ethers.constants.EtherSymbol || UniswapV2Pair))
				.symbol
			);
		}
	}

	const handleQuoteChange = (e) =>
	{
		setQuote(e.target.value);
	}

	// Uniswap params hook - on base, quote, value change
	React.useEffect(() => {
		try
		{
			const from   = props.balances[base];
			const to     = props.balances[quote];
			from.isEth   = from.symbol === ethers.constants.EtherSymbol;
			to.isEth     = to.symbol   === ethers.constants.EtherSymbol;
			const amount = ethers.utils.bigNumberify(String(Number(value) * 10 ** from.decimals));
			const method = from.isEth ? 'swapExactETHForTokens' : to.isEth ? 'swapExactTokensForETH' : 'swapExactTokensForTokens';

			const path = [
				from.address,
				!from.isEth && !to.isEth ? props.balances[ethers.constants.EtherSymbol].address : undefined, // weth
				to.address,
			].filter(Boolean);

			setUniparams({ from, to, amount, method, path });
		}
		catch
		{
			setUniparams({});
		}
	}, [props, base, quote, value]);

	// Check balance hook - on balances, base, value change
	React.useEffect(() => {
		try
		{
			setEnough(props.balances[base].balance >= value)
		} catch {}
	}, [props, base, value])

	// Predict outcome hook - on base, quote, value change
	React.useEffect(() => {
		try
		{
			router.getAmountsOut(uniparams.amount, uniparams.path)
			.then(values => setEstimated(Number(values[values.length-1]) / 10 ** uniparams.to.decimals))
			.catch(() => setEstimated(0))
		}
		catch
		{
			setEstimated(0);
		}
	}, [router, uniparams, base, quote, value]);

	// Execute hook
	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		wallet.forwardBatch([
			// approve if source is an erc20
			!uniparams.from.isEth &&
			[
				uniparams.from.address,
				'0',
				(new ethers.utils.Interface(ABIERC20)).functions['approve'].encode([ router.address, uniparams.amount ])
			],
			// call UniswapV2Router
			[
				router.address,
				uniparams.from.isEth ? uniparams.amount : 0,
				router.interface.functions[uniparams.method].encode([
					!uniparams.from.isEth ? uniparams.amount : undefined,
					'0',
					uniparams.path,
					props.data.wallet.id,
					ethers.constants.MaxUint256,
				].filter(Boolean))
			]
		].filter(Boolean))
		.then(txPromise => {
			props.services.emitter.emit('Notify', 'info', 'Transaction sent');
			txPromise.wait()
			.then(() => {
				props.services.emitter.emit('Notify', 'success', 'Transaction successfull');
				props.services.emitter.emit('tx');
			}) // success
			.catch(() => {
				props.services.emitter.emit('Notify', 'error', 'Transaction failled');
			}) // transaction error
		})
		.catch(() => {
			props.services.emitter.emit('Notify', 'error', 'Signature required');
		}) // signature error
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column align-items-stretch ${props.className}`}>
			<TextField
				error       = {!enough}
				label       = 'Pay with'
				placeholder = '0.1'
				value       = {value}
				variant     = 'outlined'
				className   = 'my-1'
				onChange    = {e => setValue(e.target.value)}
				InputProps  = {{
					startAdornment:
						<InputAdornment position='start'>
							<select value={base} onChange={handleBaseChange} style={{ 'width':'100px' }}>
								{
									Object.values(props.balances)
										.filter(({symbol, balance}) => symbol === ethers.constants.EtherSymbol || balance > 0)
										.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
								}
							</select>
						</InputAdornment>,
					endAdornment:
						<InputAdornment position='end'>
							<MDBBtn color='blue' className='z-depth-0' size='sm' onClick={() => setValue(props.balances[base].balance)}>max</MDBBtn>
						</InputAdornment>,
				}}
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
							<select value={quote} onChange={handleQuoteChange} style={{ 'width':'100px' }}>
								{
									Object.values(props.balances)
										.filter(({symbol, UniswapV2Pair}) => symbol !== base && (symbol === ethers.constants.EtherSymbol || UniswapV2Pair))
										.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
								}
							</select>
						</InputAdornment>,
				}}
			/>
			<MDBBtn color='blue' type='sumbit' className='mx-0' size='sm' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Exchange { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletTradeUniswapV2;