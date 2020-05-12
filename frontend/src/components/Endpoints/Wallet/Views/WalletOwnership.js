import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputETH from '../../../UI/AddressInputETH';

import { ethers }      from 'ethers';
import * as utils      from '../../../../libs/utils'
import NFWalletFactory from '../../../../abi/NFWalletFactory.json';


const WalletOwnership = (props) =>
{
	const [ address, setAddress ] = React.useState('');

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		utils.executePromise(
			(new ethers.Contract(props.details.account.registry, NFWalletFactory.abi, utils.getSigner(props.services))).transferFrom(props.data.wallet.owner.id, address, props.details.account.address),
			props.services,
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputETH
				color     = 'light'
				className = 'my-1'
				label     = 'destination'
				onChange  = {setAddress}
				provider  = {props.services.provider}
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!props.details.account.isOwner}>
				Transfer { !props.details.account.isOwner && '(disabled for non owners)' }
			</MDBBtn>
		</form>
	);
}

export default WalletOwnership;
