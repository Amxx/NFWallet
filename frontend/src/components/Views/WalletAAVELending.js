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
	const [ pool                ] = React.useState(new ethers.Contract(    LendingPool.networks[props.services.network.chainId].address,     LendingPool.abi, props.services.provider.getSigner()));
	const [ poolcore            ] = React.useState(new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner()));
	const [ lendable            ] = React.useState(Object.values(props.details.tokens).filter(({reserveData, isEth, balance}) => reserveData && (isEth || balance.gt(0))));

	const [ deposit, setDeposit ] = React.useState(true);
	const [ token,   setToken   ] = React.useState('ETH');
	const [ amount,  setAmount  ] = React.useState({});
	const [ enough,  setEnough  ] = React.useState(true);
	const toggle = () => setDeposit(!deposit);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset = props.details.tokens[token];
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
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : asset.address,
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
					lendable.map((token, i) =>
						<a href='#!' key={i} onClick={() => setToken(token.symbol)} className='text-center m-2'>
							<img src={token.img} alt={token.symbol} height={32}/>
							<div className='text-muted' style={{fontSize: '.8em'}}>
								{ token.symbol }
							</div>
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{ (ethers.utils.formatUnits(token.reserveData.liquidityRate, 27)*100).toFixed(2) }% APY
							</div>
						</a>
					)
				}
			</div>
			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column ${props.className}`}>
				<BalanceInput
					className     = 'my-1'
					token         = { `${deposit?'':'a'}${token}` }
					tokenDecimals = { props.details.tokens[token].decimals }
					tokenBalance  = { deposit ? props.details.tokens[token].balance : props.details.tokens[token].reserveData.aTokenBalance }
					callbacks     = {{ setAmount, setEnough }}
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

export default WalletAAVELending;
