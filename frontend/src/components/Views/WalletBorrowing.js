import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import Switch from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import LendingPool     from '../../abi/LendingPool.json';

const WalletBorrowingWrapper = (props) =>
	LendingPool.networks[props.services.network.chainId]
	? <WalletBorrowing {...props}/>
	: <div className='text-center text-muted'>AAVE is not available on this network</div>

const WalletBorrowing = (props) =>
{
	const pool       = new ethers.Contract(LendingPool.networks[props.services.network.chainId].address, LendingPool.abi, props.services.provider.getSigner());
	const borrowable = Object.values(props.balances).filter(({reserveData}) => reserveData)

	const [ stableRate, setStableRate ] = React.useState(false);
	const [ token,      setToken      ] = React.useState('ETH');
	const [ amount,     setAmount     ] = React.useState('');
	const [ enough,     setEnough     ] = React.useState(true);
	const toggleRate = () => setStableRate(!stableRate);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset = props.balances[token];
		const value = amount.value;

		utils.executeTransactions(
			props.data.wallet.id,
			[
				[
					pool.address,
					0,
					pool.interface.functions.borrow.encode([
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : props.balances[token].address,
						value,
						stableRate ? 1 : 2,
						0 // referal code
					])
				]
			],
			props.services
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					borrowable.map(({symbol, img}) =>
						<a href='#!' onClick={() => setToken(symbol)} className='text-center m-2'>
							<img src={img} alt={symbol} height={32}/>
							<div className='text-muted'>
								{symbol}
							</div>
						</a>
					)
				}
			</div>

			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column ${props.className}`}>
				<BalanceInput
					balances   = { props.balances }
					token      = { token }
					callbacks  = {{ setAmount, setEnough }}
					unlimited
				/>

				<div className='d-flex justify-content-center align-items-center'>
					<span className='text-muted'>variable rate</span>
						<Switch color='primary' checked={stableRate} onChange={toggleRate}/>
					<span className='text-muted'>fixed rate</span>
				</div>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
					Borrow {token} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

// <a href='#!' className='d-flex align-items-center justify-content-center' onClick={toggle}>
// <div>{token}</div>
// <MDBIcon icon={deposit?'long-arrow-alt-right':'long-arrow-alt-left'} className='px-2'/>
// <div>a{token}</div>
// </a>

export default WalletBorrowingWrapper;
