import * as React from 'react';
import {
	MDBAlert,
	MDBBtn,
} from 'mdbreact';
import AddressInputENS from '../UI/AddressInputENS';
import TextField       from '@material-ui/core/TextField';
import InputAdornment  from '@material-ui/core/InputAdornment';
import { ethers } from 'ethers';
import { abi as ABIWallet } from '../../abi/NFWallet.json';


const WalletTX = (props) =>
{
	const [ addr,  setAddr ] = React.useState('');
	const [ value, setValue] = React.useState(null);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		(new ethers.Contract(props.data.wallet.id, ABIWallet, props.services.provider.getSigner()))
		.forward(addr, ethers.utils.parseUnits(value, 'ether'), '0x')
		.then(txPromise => {
			props.services.emitter.emit('Notify', 'info', 'Transaction sent');
			txPromise.wait()
			.then(() => {
				props.services.emitter.emit('Notify', 'success', 'Transaction successfull');
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
		(props.data.wallet.owner.id === props.services.accounts[0].toLowerCase())
		?
			<>
				<form onSubmit={handleSubmit} className='d-flex flex-column'>
					<AddressInputENS
						className='my-1'
						label='destination'
						defaultValue={addr}
						onChange={setAddr}
						provider={props.services.provider}
					/>
					<TextField
						className='my-1'
						label='amount'
						placeholder='0.1'
						onChange={e => setValue(e.target.value)}
						InputProps={{
							startAdornment: <InputAdornment position="start">{ethers.constants.EtherSymbol}</InputAdornment>,
						}}
						variant='outlined'
					/>
					<MDBBtn color='blue' type='sumbit' className='mx-0' size='sm'>Send</MDBBtn>
				</form>
			</>
		:
			<MDBAlert color='danger'>
				Only the owner of this wallet can submit transactions
			</MDBAlert>
	);
}

export default WalletTX;
