import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputETH from '../../../UI/AddressInputETH';
import BalanceInput    from '../../../UI/BalanceInput';

import * as utils from '../../../../libs/utils'

import ERC20      from '../../../../abi/ERC20.json';


const WalletSend = (props) =>
{
	const [ sendable            ] = React.useState(Object.values(props.details.tokens).filter(({isEth, balance}) => isEth || balance.gt(0)));

	const [ token,   setToken   ] = React.useState(props.details.tokens['ETH']);
	const [ addr,    setAddr    ] = React.useState('');
	const [ amount,  setAmount  ] = React.useState({});
	const [ enough,  setEnough  ] = React.useState(true);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		utils.executeTransactions(
			props.details.account.address,
			[{
				address:  token.isEth ? addr : token.address,
				value:    token.isEth  && amount.value,
				artefact: !token.isEth && ERC20,
				method:   !token.isEth && 'transfer',
				args:     !token.isEth && [ addr, amount.value ],
			}],
			props.services
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>

			<AddressInputETH
				color       = 'light'
				label       = 'destination'
				className   = 'my-1'
				onChange    = {setAddr}
				provider    = {props.services.provider}
			/>

			<BalanceInput
				label         = 'Send'
				className     = 'my-1'
				tokenSymbol   = { token.symbol }
				tokenSelector = { sendable }
				tokenDecimals = { token.decimals }
				tokenBalance  = { token.balance }
				callbacks     = {{ setToken: (symbol) => setToken(props.details.tokens[symbol]), setAmount, setEnough }}
			/>

			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner}>
				Send {token.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
			</MDBBtn>

		</form>
	);
}

export default WalletSend;
