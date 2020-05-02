import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import Switch       from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import ERC20          from '../../abi/ERC20.json';
import CEther         from '../../abi/CEther.json';
import CToken         from '../../abi/CToken.json';
import Comptroller    from '../../abi/Comptroller.json';
import CEtherRedeemer from '../../abi/CEtherRedeemer.json';


const WalletCompoundLending = (props) =>
{
	const [ comptroller         ] = React.useState(new ethers.Contract(   Comptroller.networks[props.services.network.chainId].address,    Comptroller.abi, props.services.provider.getSigner()));
	const [ redeemer            ] = React.useState(new ethers.Contract(CEtherRedeemer.networks[props.services.network.chainId].address, CEtherRedeemer.abi, props.services.provider.getSigner()));
	const [ lendable            ] = React.useState(Object.values(props.details.tokens).filter(({compound, isEth, balance}) => compound && (isEth || balance.gt(0))));

	const [ deposit, setDeposit ] = React.useState(!props.withdraw);
	const [ token,   setToken   ] = React.useState(props.details.tokens['ETH']);
	const [ amount,  setAmount  ] = React.useState({});
	const [ limit,   setLimit   ] = React.useState(ethers.constants.Zero);
	const [ enough,  setEnough  ] = React.useState(true);
	const toggle = () => setDeposit(!deposit);

	React.useEffect(() => {
		setLimit(
			token.compound.cTokenBalance
				.mul(token.compound.exchangeRateStored)
				.div(ethers.constants.WeiPerEther)
		)
	}, [props, token])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const assetIn = props.details.account.compound.assetsIn.indexOf(token.compound.cTokenAddress) !== -1;
		console.log(assetIn)
		utils.executeTransactions(
			props.details.account.address,
			[
				deposit && !token.isEth &&
				[
					token.address,
					ethers.constants.Zero,
					(new ethers.utils.Interface(ERC20.abi)).functions.approve.encode([token.compound.cTokenAddress, amount.value]),
				],
				deposit && [
					token.compound.cTokenAddress,
					token.isEth ? amount.value : ethers.constants.Zero,
					(new ethers.utils.Interface((token.isEth ? CEther : CToken).abi)).functions.mint.encode(token.isEth ? [] : [amount.value]),
				],
				deposit && ! assetIn && [
					comptroller.address,
					ethers.constants.Zero,
					comptroller.interface.functions.enterMarkets.encode([[token.compound.cTokenAddress]]),
				],
				!deposit && token.isEth && [
					token.compound.cTokenAddress,
					ethers.constants.Zero,
					(new ethers.utils.Interface(ERC20.abi)).functions.transfer.encode([redeemer.address, token.compound.cTokenBalance]),
				],
				!deposit && !amount.max && [
					token.isEth ? redeemer.address : token.compound.cTokenAddress,
					ethers.constants.Zero,
					redeemer.interface.functions.redeemUnderlying.encode([amount.value]),
				],
				!deposit && amount.max && [
					token.isEth ? redeemer.address : token.compound.cTokenAddress,
					ethers.constants.Zero,
					redeemer.interface.functions.redeem.encode([token.compound.cTokenBalance]),
				],
			],
			props.services,
			{
				sigerror: console.error
			}
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
						</a>
					)
				}
			</div>
			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column justify-content-center ${props.className}`}>
				<BalanceInput
					className     = 'my-1'
					token         = { token.symbol }
					tokenDecimals = { token.decimals }
					tokenBalance  = { deposit ? token.balance : limit }
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

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner }>
					{deposit?'Deposit':'Withdraw'} {token.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletCompoundLending;
