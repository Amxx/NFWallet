import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import ERC20           from '../../abi/ERC20.json';
import LendingPool     from '../../abi/LendingPool.json';
import LendingPoolCore from '../../abi/LendingPoolCore.json';


const WalletRepayingWrapper = (props) =>
	LendingPool.networks[props.services.network.chainId]
	? Object.values(props.balances).find(({reserveData}) => reserveData && reserveData.borrowBalance)
	? <WalletRepaying {...props}/>
	: <div className='text-center text-muted'>This wallet doesn't have any loans to repay</div>
	: <div className='text-center text-muted'>AAVE is not available on this network</div>

const WalletRepaying = (props) =>
{
	const pool      = new ethers.Contract(LendingPool.networks[props.services.network.chainId].address, LendingPool.abi, props.services.provider.getSigner());
	const poolcore  = new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner());
	const repayable = Object.values(props.balances).filter(({reserveData}) => reserveData && reserveData.borrowBalance)

	const [ token,      setToken      ] = React.useState(repayable[0].symbol);
	const [ amount,     setAmount     ] = React.useState('');
	const [ enough,     setEnough     ] = React.useState(true);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset      = props.balances[token];
		const available  = props.balances[token].balance                   * 10 ** props.balances[token].decimals;
		const debt       = props.balances[token].reserveData.borrowBalance * 10 ** props.balances[token].decimals;
		const all        = amount.max && amount.value == debt; // don't use ===, comparing string & number
		const value      = ethers.utils.bigNumberify(String(all ? ethers.constants.MaxUint256                         : amount.value));
		const approve    = ethers.utils.bigNumberify(String(all ? Math.min(Math.round(amount.value * 1.1), available) : amount.value));

		utils.executeTransactions(
			props.data.wallet.id,
			[
				!asset.isEth &&
				[
					asset.address,
					'0',
					(new ethers.utils.Interface(ERC20.abi)).functions.approve.encode([ poolcore.address, approve ])
				],
				[
					pool.address,
					asset.isEth ? approve : 0,
					pool.interface.functions.repay.encode([
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : props.balances[token].address,
						value,
						props.data.wallet.id,
					])
				]
			],
			props.services,
			{
				sigerror: console.log
			}
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					repayable.map(({symbol, img, reserveData}, i) =>
						<a href='#!' key={i} onClick={() => setToken(symbol)} className='text-center m-2'>
							<img src={img} alt={symbol} height={32}/>
							<div className='text-muted' style={{fontSize: '.8em'}}>{symbol}</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>{reserveData.borrowBalance}</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>{(reserveData.borrowRate*100).toFixed(2)}% APY</div>
						</a>
					)
				}
			</div>

			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column ${props.className}`}>
				<BalanceInput
					balances   = { props.balances }
					token      = { token }
					callbacks  = {{ setAmount, setEnough }}
					maxvalue   = { props.balances[token].reserveData.borrowBalance }
				/>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
					Repay {token} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletRepayingWrapper;
