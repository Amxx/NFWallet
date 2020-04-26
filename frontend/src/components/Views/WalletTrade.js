import * as React from 'react';
import {
	MDBAlert,
	MDBBtn,
} from 'mdbreact';
import InputAdornment  from '@material-ui/core/InputAdornment';
import TextField       from '@material-ui/core/TextField';

import { ethers } from 'ethers';
import { abi as ABIERC20             } from '../../abi/ERC20.json';
import { abi as ABIWallet            } from '../../abi/NFWallet.json';
import { abi as ABIUniswapV2Router01 } from '../../abi/UniswapV2Router01.json';



const WalletTrade = (props) =>
{
	const router = new ethers.Contract(props.services.config.exchange.UniswapV2Router, ABIUniswapV2Router01, props.services.provider.getSigner());
	const wallet = new ethers.Contract(props.data.wallet.id, ABIWallet, props.services.provider.getSigner());

	const [ balances,  setBalances ] = React.useState([]);
	const [ base,      setBase     ] = React.useState(ethers.constants.EtherSymbol);
	const [ quote,     setQuote    ] = React.useState('DAI');
	const [ value,     setValue    ] = React.useState(0);
	const [ estimated, setEstimated] = React.useState(0);

	const handleBaseChange = (e) =>
	{
		setBase(e.target.value);
		if (e.target.value === quote)
		{
			setQuote(balances.find(({symbol, pair}) => symbol !== e.target.value && (symbol === ethers.constants.EtherSymbol || pair)).symbol)
		}
	}
	const handleQuoteChange = (e) =>
	{
		setQuote(e.target.value);
	}


	React.useEffect(() => {
		Promise.all(
			Object.entries(props.services.config.exchange.tokens)
			.map(async ([ symbol, token ], i) => {
				const contract = new ethers.Contract(token.address, ABIERC20, props.services.provider.getSigner());
				const amount   = await contract.balanceOf(props.data.wallet.id);
				return { symbol, ...token, balance: amount / 10 ** token.decimals };
			})
		).then(tokens => setBalances([
				{
					symbol:   ethers.constants.EtherSymbol,
					name:     'ether',
					decimals: 18,
					balance:  props.data.wallet.balance,
					img:      'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
				},
				...tokens.sort((t1, t2) => t1.balance < t2.balance)
			]))
	}, [props])

	React.useEffect(() => {
		console.log('estimate');
		setEstimated('estimated value comming soon');
	}, [base, quote, value]);


	const handleSubmit = () =>
	{
		const amount  = ethers.utils.bigNumberify(String(Number(value) * 10 ** balances.find(({symbol}) => symbol === base).decimals))
		const fromEth = base  === ethers.constants.EtherSymbol;
		const toEth   = quote === ethers.constants.EtherSymbol;
		const weth    = props.services.config.exchange.tokens.WETH;

		const path = [
			fromEth            ? weth.address : props.services.config.exchange.tokens[base ].address,
			!fromEth && !toEth ? weth.address : undefined,
			toEth              ? weth.address : props.services.config.exchange.tokens[quote].address,
		].filter(Boolean)

		wallet.forwardBatch([
			// approve if source is an erc20
			!fromEth &&
			[
				path[0],
				'0',
				(new ethers.utils.Interface(ABIERC20)).functions['approve'].encode([
					router.address,
					amount,
				])
			],
			// call UniswapV2Router
			[
				router.address,
				fromEth ? amount : 0,
				router.interface.functions[fromEth ? 'swapExactETHForTokens' : toEth ? 'swapExactTokensForETH' : 'swapExactTokensForTokens'].encode([
					!fromEth ? amount : undefined,
					'0',
					path,
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
		(props.data.wallet.owner.id === props.services.accounts[0].toLowerCase())
		?
			<div className={`d-flex flex-column align-items-stretch ${props.className}`}>
				<TextField
					className='my-1'
					label='Pay with'
					placeholder='0.1'
					value={value}
					onChange={e => setValue(e.target.value)}
					InputProps={{
						startAdornment:
							<InputAdornment position='start'>
								<select value={base} onChange={handleBaseChange} style={{ 'width':'100px' }}>
									{
										balances
											.filter(({balance}) => balance > 0)
											.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
									}
								</select>
							</InputAdornment>,
						endAdornment:
							<InputAdornment position='end'>
								<MDBBtn color='blue' className='z-depth-0' size='sm' onClick={() => setValue(balances.find(({symbol}) => symbol === base).balance)}>max</MDBBtn>
							</InputAdornment>,
					}}
					variant='outlined'
				/>
				<TextField
					disabled
					className='my-1'
					label='Receive'
					placeholder='0.1'
					value={estimated}
					InputProps={{
						startAdornment:
							<InputAdornment position='start'>
								<select value={quote} onChange={handleQuoteChange} style={{ 'width':'100px' }}>
									{
										balances
											.filter(({symbol, pair}) => symbol !== base && (symbol === ethers.constants.EtherSymbol || pair))
											.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
									}
								</select>
							</InputAdornment>,
					}}
					variant='outlined'
				/>
				<MDBBtn color='blue' className='z-depth-0 mx-0' size='sm' onClick={handleSubmit}>Exchange</MDBBtn>
			</div>
		:
			<MDBAlert color='danger'>
				Only the owner of this wallet can submit transactions
			</MDBAlert>
	);
}

export default WalletTrade;
