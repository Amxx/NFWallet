import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputENS from '../../../UI/AddressInputENS';

import * as utils from '../../../../libs/utils'


const WalletOwnership = (props) =>
{
	const [ addr, setAddr ] = React.useState('');

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		utils.executePromise(
			props.services.registry.transferFrom(props.data.wallet.owner.id, addr, props.details.account.address),
			props.services,
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputENS
				color     = 'light'
				className = 'my-1'
				label     = 'destination'
				onChange  = {setAddr}
				provider  = {props.services.provider}
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!props.details.account.isOwner}>
				Transfer { !props.details.account.isOwner && '(disabled for non owners)' }
			</MDBBtn>
		</form>
	);
}

export default WalletOwnership;
