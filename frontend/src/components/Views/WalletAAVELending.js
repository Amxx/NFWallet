import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import Switch       from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import ERC20           from '../../abi/ERC20.json';
import LendingPool     from '../../abi/LendingPool.json';
import LendingPoolCore from '../../abi/LendingPoolCore.json';
import AToken          from '../../abi/AToken.json';


const WalletAAVELending = (props) =>
{
	const [ poolAddress         ] = React.useState(    LendingPool.networks[props.services.network.chainId].address);
	const [ poolcoreAddress     ] = React.useState(LendingPoolCore.networks[props.services.network.chainId].address);
	const [ lendable            ] = React.useState(Object.values(props.details.tokens).filter(({aave, isEth, balance}) => aave));

	const [ deposit, setDeposit ] = React.useState(!props.withdraw);
	const [ token,   setToken   ] = React.useState(props.details.tokens['ETH']);
	const [ amount,  setAmount  ] = React.useState({});
	const [ enough,  setEnough  ] = React.useState(true);
	const toggle = () => setDeposit(!deposit);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const value = (amount.max && !deposit) ? ethers.constants.MaxUint256 : amount.value;

		utils.executeTransactions(
			props.details.account.address,
			[
				deposit && !token.isEth &&
				{
					address:  token.address,
					artefact: ERC20,
					method:   'approve',
					args:     [ poolcoreAddress, value ],
				},
				deposit &&
				{
					address:  poolAddress,
					value:    token.isEth && value,
					artefact: LendingPool,
					method:   'deposit',
					args:     [ token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address, value, 0 /*referal code*/ ],
				},
				!deposit &&
				{
					address:  token.aave.aTokenAddress,
					artefact: AToken,
					method:   'redeem',
					args:     [ value ],
				}
			],
			props.services
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					lendable.map((token, i) =>
						<a href='#!' key={i} onClick={() => setToken(token)} className='text-center m-2'>
							<img src={token.img} alt={token.symbol} height={32}/>
							<div className='text-muted' style={{fontSize: '.8em'}}>
								{ token.symbol }
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{
									Number(ethers.utils.formatUnits(
										deposit
											? token.balance
											: token.aave.aTokenBalance,
											token.decimals
									)).toFixed(6)
								}
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{ (ethers.utils.formatUnits(token.aave.liquidityRate, 27)*100).toFixed(2) }% APY
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
					tokenBalance  = { deposit ? token.balance : token.aave.aTokenBalance }
					callbacks     = {{ setAmount, setEnough }}
				/>

				{
					!props.fixed &&
					<div className='d-flex justify-content-center align-items-center'>
						<span className='text-muted'>deposit</span>
							<Switch color='primary' checked={!deposit} onChange={toggle}/>
						<span className='text-muted'>withdraw</span>
					</div>
				}

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner}>
					{deposit?'Deposit':'Withdraw'} {token.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletAAVELending;
