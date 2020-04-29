import * as React from 'react';
import { MDBBtn, MDBIcon } from 'mdbreact';
import InputAdornment  from '@material-ui/core/InputAdornment';
import TextField       from '@material-ui/core/TextField';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import ERC20           from '../../abi/ERC20.json';
import LendingPool     from '../../abi/LendingPool.json';
import LendingPoolCore from '../../abi/LendingPoolCore.json';
import AToken          from '../../abi/AToken.json';


const WalletLendingWrapper = (props) =>
	LendingPool.networks[props.services.network.chainId] && LendingPoolCore.networks[props.services.network.chainId].address
	? <WalletLending {...props}/>
	: <div className='text-center text-muted'>AAVE is not available on this network</div>


const WalletLending = (props) =>
{
	const pool     = new ethers.Contract(    LendingPool.networks[props.services.network.chainId].address,     LendingPool.abi, props.services.provider.getSigner());
	const poolcore = new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner());

	const [ deposit,   setDeposit   ] = React.useState(true);
	const [ token,     setToken     ] = React.useState(ethers.constants.EtherSymbol);
	const [ value,     setValue     ] = React.useState('');
	const [ enough,    setEnough    ] = React.useState(true);
	const toggle = () => setDeposit(!deposit);

	React.useEffect(() => {
		try
		{
			setEnough((deposit ? props.balances[token].balance : props.balances[token].aBalance) >= value || 'max' === value)
		} catch {}
	}, [props, deposit, token, value])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset  = props.balances[token];
		const amount =
			value === 'max'
			? !deposit
			? ethers.constants.MaxUint256
			: ethers.utils.bigNumberify(String(Number(asset.balance) * 10 ** asset.decimals))
			: ethers.utils.bigNumberify(String(Number(value)         * 10 ** asset.decimals));

		utils.executeTransactions(
			props.data.wallet.id,
			[
				deposit && !asset.isEth &&
				[
					asset.address,
					'0',
					(new ethers.utils.Interface(ERC20.abi)).functions.approve.encode([ poolcore.address, amount ])
				],
				deposit && [
					pool.address,
					asset.isEth ? amount : 0,
					pool.interface.functions.deposit.encode([
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : props.balances[token].address,
						amount,
						0
					])
				],
				!deposit && [
					asset.aAddress,
					0,
					(new ethers.utils.Interface(AToken.abi)).functions.redeem.encode([amount])
				]
			],
			props.services
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>

			<a href='#!' className='d-flex align-items-center justify-content-center' onClick={toggle}>
				<div>{token}</div>
				<MDBIcon icon={deposit?'long-arrow-alt-right':'long-arrow-alt-left'} className='px-2'/>
				<div>a{token}</div>
			</a>

			<TextField
				error       = {!enough}
				label       = 'amount'
				placeholder = '0.1'
				value       = {value}
				variant     = 'outlined'
				className   = 'my-1'
				onChange    = {e => setValue(e.target.value)}
				InputProps  = {{
					startAdornment:
						<InputAdornment position='start'>
							<select value={token} onChange={(e) => setToken(e.target.value)} style={{ 'width':'100px' }}>
								{
									Object.values(props.balances)
										.filter(({aAddress})                 => aAddress)
										.filter(({isEth, balance, aBalance}) => isEth || (deposit && balance > 0) || (!deposit && aBalance > 0))
										.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
								}
							</select>
						</InputAdornment>,
					endAdornment:
						<InputAdornment position='end'>
							<MDBBtn color='light' className='z-depth-0' size='sm' onClick={() => setValue('max')}>max</MDBBtn>
						</InputAdornment>,
				}}
			/>

			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				{deposit?'Deposit':'Withdraw'} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
			</MDBBtn>
		</form>
	);
}

export default WalletLendingWrapper;
