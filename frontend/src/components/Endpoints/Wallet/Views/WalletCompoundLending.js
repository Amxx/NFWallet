import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../../../UI/BalanceInput';
import Switch       from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../../../libs/utils'

import ERC20          from '../../../../abi/ERC20.json';
import CEther         from '../../../../abi/CEther.json';
import CToken         from '../../../../abi/CToken.json';
import Comptroller    from '../../../../abi/Comptroller.json';


const WalletCompoundLending = (props) =>
{
	const [ comptrollerAddress  ] = React.useState(Comptroller.networks[props.services.network.chainId].address);
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
				{
					address:  token.address,
					artefact: ERC20,
					method:   'approve',
					args:     [ token.compound.cTokenAddress, amount.value ],
				},
				deposit &&
				{
					address:  token.compound.cTokenAddress,
					value:    token.isEth && amount.value,
					artefact: token.isEth ? CEther : CToken,
					method:   'mint',
					args:     token.isEth ? [] : [ amount.value ],
				},
				deposit && ! assetIn &&
				{
					address:  comptrollerAddress,
					artefact: Comptroller,
					method:   'enterMarkets',
					args:     [[ token.compound.cTokenAddress ]],
				},
				!deposit && !amount.max &&
				{
					address:  token.compound.cTokenAddress,
					artefact: CToken,
					method:   'redeemUnderlying',
					args:     [amount.value],
				},
				!deposit && amount.max &&
				{
					address:  token.compound.cTokenAddress,
					artefact: CToken,
					method:   'redeem',
					args:     [token.compound.cTokenBalance],
				},
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
							<div className='text-muted' style={{fontSize: '.6em'}}>
								{
									Number(ethers.utils.formatUnits(
										token.compound.cTokenBalance
											.mul(token.compound.exchangeRateStored)
											.div(ethers.constants.WeiPerEther),
										token.decimals
									))
									.toFixed(3)
								}
							</div>
						</a>
					)
				}
			</div>
			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column justify-content-center ${props.className}`}>
				<BalanceInput
					className     = 'my-1'
					tokenSymbol   = { token.symbol }
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
