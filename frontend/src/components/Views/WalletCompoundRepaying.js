import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';

import { ethers }   from 'ethers';
import * as utils   from '../../libs/utils'

import ERC20        from '../../abi/ERC20.json';
import CEther       from '../../abi/CEther.json';
import CToken       from '../../abi/CToken.json';


const WalletCompoundRepayingWrapper = (props) =>
	Object.values(props.details.tokens).find(({compound}) => compound && compound.borrowBalance.gt(0))
	? <WalletCompoundRepaying {...props}/>
	: <div className='text-center text-muted'>This wallet doesn't have any loans to repay</div>

const WalletCompoundRepaying = (props) =>
{
	const [ repayable         ] = React.useState(Object.values(props.details.tokens).filter(({compound}) => compound && compound.borrowBalance.gt(0)));

	const [ token,  setToken  ] = React.useState(repayable[0]);
	const [ amount, setAmount ] = React.useState({});
	const [ enough, setEnough ] = React.useState(true);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const everything = amount.max && amount.value === token.compound.borrowBalance;
		const value      = !everything ? amount.value : ethers.constants.MaxUint256;
		const approve    = !everything ? amount.value : utils.BNmin((amount.value.add(amount.value.div(20))), token.balance);

		utils.executeTransactions(
			props.details.account.address,
			[
				!token.isEth &&
				{
					address:  token.address,
					artefact: ERC20,
					method:   'approve',
					args:     [ token.compound.cTokenAddress, approve ],
				},
				{
					address:  token.compound.cTokenAddress,
					value:    token.isEth && amount.value,
					artefact: token.isEth ? CEther : CToken,
					method:   'repayBorrow',
					args:     token.isEth ? [] : [value]
				},
			],
			props.services
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					repayable.map((token, i) =>
						<a href='#!' key={i} onClick={() => setToken(token)} className='text-center m-2'>
							<img src={token.img} alt={token.symbol} height={32}/>
							<div className='text-muted' style={{fontSize: '.8em'}}>
								{ token.symbol }
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{ ethers.utils.formatUnits(token.compound.borrowBalance, token.decimals) }
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{ (((1 + (token.compound.borrowRatePerBlock / 10**18)) ** 2254114 - 1) * 100).toFixed(3) }% APY
							</div>
						</a>
					)
				}
			</div>

			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column justify-content-center ${props.className}`}>
				<BalanceInput
					className     = 'my-1'
					token         = { token.symbol }
					tokenDecimals = { token.decimals }
					tokenBalance  = { utils.BNmin(token.compound.borrowBalance, token.balance) }
					callbacks     = {{ setAmount, setEnough }}
				/>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner}>
					Repay {token.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletCompoundRepayingWrapper;
