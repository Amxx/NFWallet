import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import Switch       from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import ERC20          from '../../abi/ERC20.json';
import CEther         from '../../abi/CEther.json';
import CToken         from '../../abi/CToken.json';
import CEtherRedeemer from '../../abi/CEtherRedeemer.json';

const WalletCompoundLending = (props) =>
{
	const [ redeemer            ] = React.useState(new ethers.Contract(CEtherRedeemer.networks[props.services.network.chainId].address, CEtherRedeemer.abi, props.services.provider.getSigner()));
	const [ lendable            ] = React.useState(Object.values(props.details.tokens).filter(({compound, isEth, balance}) => compound && (isEth || balance.gt(0))));

	const [ deposit, setDeposit ] = React.useState(!props.withdraw);
	const [ token,   setToken   ] = React.useState('ETH');
	const [ amount,  setAmount  ] = React.useState({});
	const [ limit,   setLimit   ] = React.useState(ethers.constants.Zero);
	const [ enough,  setEnough  ] = React.useState(true);
	const toggle = () => setDeposit(!deposit);

	React.useEffect(() => {
		setLimit(
			props.details.tokens[token].compound.balance
				.mul(props.details.tokens[token].compound.exchangeRate)
				.div(ethers.constants.WeiPerEther)
		)
	}, [props, token])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset = props.details.tokens[token];

		utils.executeTransactions(
			props.data.wallet.id,
			[
				deposit && !asset.isEth &&
				[
					asset.address,
					ethers.constants.Zero,
					(new ethers.utils.Interface(ERC20.abi)).functions.approve.encode([asset.ctoken, amount.value])
				],
				deposit && [
					asset.ctoken,
					asset.isEth ? amount.value : ethers.constants.Zero,
					(new ethers.utils.Interface((asset.isEth ? CEther : CToken).abi)).functions.mint.encode(asset.isEth ? [] : [amount.value]),
				],
				!deposit && asset.isEth && [
					asset.ctoken,
					ethers.constants.Zero,
					(new ethers.utils.Interface(ERC20.abi)).functions.transfer.encode([redeemer.address, asset.compound.balance]),
				],
				!deposit && !amount.max && [
					asset.isEth ? redeemer.address : asset.ctoken,
					ethers.constants.Zero,
					redeemer.interface.functions.redeemUnderlying.encode([amount.value]),
				],
				!deposit && amount.max && [
					asset.isEth ? redeemer.address : asset.ctoken,
					ethers.constants.Zero,
					redeemer.interface.functions.redeem.encode([asset.compound.balance]),
				]
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
						<a href='#!' key={i} onClick={() => setToken(token.symbol)} className='text-center m-2'>
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
					token         = { `${deposit?'':'c'}${token}` }
					tokenDecimals = { props.details.tokens[token].decimals }
					tokenBalance  = { deposit ? props.details.tokens[token].balance : limit }
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

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
					{deposit?'Deposit':'Withdraw'} {token} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletCompoundLending;
