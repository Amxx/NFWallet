import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputENS from '../UI/AddressInputENS';


const WalletTransfer = (props) =>
{
	const [ addr, setAddr ] = React.useState('');

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		props.services.registry.transferFrom(props.data.wallet.owner.id, addr, props.data.wallet.id)
		.then(txPromise => {
			props.services.emitter.emit('Notify', 'info', 'Transaction sent');
			txPromise.wait()
			.then(() => {
				props.services.emitter.emit('Notify', 'success', 'Transaction successfull');
				props.services.emitter.emit('tx');
			}) // success
			.catch(() => {
				props.services.emitter.emit('Notify', 'error', 'Transaction failled');
			}) // transaction error
		})
		.catch(() => {
			props.services.emitter.emit('Notify', 'error', 'Signature required');
		}) // signature error
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputENS
				className='my-1'
				label='destination'
				defaultValue={addr}
				onChange={setAddr}
				provider={props.services.provider}
			/>
			<MDBBtn color='blue' type='sumbit' className='mx-0' size='sm' disabled={ (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Transfer { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletTransfer;
