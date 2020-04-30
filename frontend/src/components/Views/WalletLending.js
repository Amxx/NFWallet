import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import Switch from '@material-ui/core/Switch';

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
	const lendable = Object.values(props.balances).filter(({reserveData}) => reserveData)

	const [ deposit, setDeposit ] = React.useState(true);
	const [ token,   setToken   ] = React.useState('ETH');
	const [ amount,  setAmount  ] = React.useState('');
	const [ enough,  setEnough  ] = React.useState(true);
	const toggle = () => setDeposit(!deposit);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset = props.balances[token];
		const value = (amount.max && !deposit) ? ethers.constants.MaxUint256 : amount.value;

		utils.executeTransactions(
			props.data.wallet.id,
			[
				deposit && !asset.isEth &&
				[
					asset.address,
					'0',
					(new ethers.utils.Interface(ERC20.abi)).functions.approve.encode([ poolcore.address, value ])
				],
				deposit && [
					pool.address,
					asset.isEth ? value : 0,
					pool.interface.functions.deposit.encode([
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : props.balances[token].address,
						value,
						0 // referal code
					])
				],
				!deposit && [
					asset.reserveData.aTokenAddress,
					0,
					(new ethers.utils.Interface(AToken.abi)).functions.redeem.encode([value])
				]
			],
			props.services
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					lendable.map(({symbol, img}, i) =>
						<a href='#!' key={i} onClick={() => setToken(symbol)} className='text-center m-2'>
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
					switchAAVE = { !deposit }
				/>

				<div className='d-flex justify-content-center align-items-center'>
					<span className='text-muted'>deposit</span>
						<Switch color='primary' checked={!deposit} onChange={toggle}/>
					<span className='text-muted'>withdraw</span>
				</div>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
					{deposit?'Deposit':'Withdraw'} {token} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletLendingWrapper;
