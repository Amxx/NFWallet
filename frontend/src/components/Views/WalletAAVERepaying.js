import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import ERC20           from '../../abi/ERC20.json';
import LendingPool     from '../../abi/LendingPool.json';
import LendingPoolCore from '../../abi/LendingPoolCore.json';


const WalletAAVERepayingWrapper = (props) =>
	Object.values(props.details.tokens).find(({reserveData}) => reserveData && reserveData.borrowBalance.gt(0))
	? <WalletAAVERepaying {...props}/>
	: <div className='text-center text-muted'>This wallet doesn't have any loans to repay</div>

const WalletAAVERepaying = (props) =>
{
	const [ pool              ] = React.useState(new ethers.Contract(LendingPool.networks[props.services.network.chainId].address, LendingPool.abi, props.services.provider.getSigner()));
	const [ poolcore          ] = React.useState(new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner()));
	const [ repayable         ] = React.useState(Object.values(props.details.tokens).filter(({reserveData}) => reserveData && reserveData.borrowBalance.gt(0)));

	const [ token,  setToken  ] = React.useState(repayable[0].symbol);
	const [ amount, setAmount ] = React.useState({});
	const [ enough, setEnough ] = React.useState(true);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset      = props.details.tokens[token];
		const everything = amount.max && amount.value === asset.reserveData.borrowBalance;
		const value      = !everything ? amount.value : ethers.constants.MaxUint256;
		const approve    = !everything ? amount.value : utils.BNmin((amount.value.add(amount.value.div(20))), asset.balance);

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
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : asset.address,
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
					repayable.map((token, i) =>
						<a href='#!' key={i} onClick={() => setToken(token.symbol)} className='text-center m-2'>
							<img src={token.img} alt={token.symbol} height={32}/>
							<div className='text-muted' style={{fontSize: '.8em'}}>
								{ token.symbol }
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{ ethers.utils.formatUnits(token.reserveData.borrowBalance, token.decimals) }
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{ (ethers.utils.formatUnits(token.reserveData.borrowRate, 27)*100).toFixed(2) }% APY
							</div>
						</a>
					)
				}
			</div>

			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column justify-content-center ${props.className}`}>
				<BalanceInput
					className     = 'my-1'
					token         = { token }
					tokenDecimals = { props.details.tokens[token].decimals }
					tokenBalance  = { utils.BNmin(props.details.tokens[token].reserveData.borrowBalance, props.details.tokens[token].balance) }
					callbacks     = {{ setAmount, setEnough }}
				/>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
					Repay {token} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletAAVERepayingWrapper;
