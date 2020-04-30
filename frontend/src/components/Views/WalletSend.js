import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputENS from '../UI/AddressInputENS';
import BalanceInput    from '../UI/BalanceInput';

import { ethers } from 'ethers';
import * as utils from '../../libs/utils'

import ERC20      from '../../abi/ERC20.json';


const WalletSend = (props) =>
{
	const [ token,   setToken   ] = React.useState('ETH');
	const [ addr,    setAddr    ] = React.useState('');
	const [ amount,  setAmount  ] = React.useState('');
	const [ enough,  setEnough  ] = React.useState(true);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset = props.balances[token];

		utils.executeTransactions(
			props.data.wallet.id,
			[[
				asset.isEth ? addr         : asset.address,
				asset.isEth ? amount.value : 0,
				asset.isEth ? '0x'         : (new ethers.utils.Interface(ERC20.abi)).functions['transfer'].encode([ addr, amount.value ]),
			]],
			props.services
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputENS
				color       = 'light'
				label       = 'destination'
				className   = 'my-1'
				onChange    = {setAddr}
				provider    = {props.services.provider}
			/>
			<BalanceInput
				balances   = { props.balances }
				filter     = { ({isEth, balance}) => isEth || balance > 0 }
				callbacks  = {{ setToken, setAmount, setEnough }}
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Send { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletSend;