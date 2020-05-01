import React from 'react';
import {
	MDBBtn,
	MDBNavLink,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
} from 'mdbreact';
import { ethers } from 'ethers';

import TextField       from '@material-ui/core/TextField';
import AddressInputENS from '../UI/AddressInputENS';
import Switch          from '@material-ui/core/Switch';

const MintWallet = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const [ full, setFull ] = React.useState(!!props.advanced);
	const [ addr, setAddr ] = React.useState(props.services.accounts[0]);
	const [ seed, setSeed ] = React.useState('');
	const toggle     = () => setOpen(!open);
	const toggleFull = () => setFull(!full);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();
		props.services.registry.createWallet(
			addr,
			full ? ethers.utils.id(seed) : ethers.utils.randomBytes(32),
		)
		.then(txPromise => {
			props.services.emitter.emit('Notify', 'info', 'Transaction sent');
			txPromise.wait()
			.then(tx => {
				props.services.emitter.emit('Notify', 'success', 'New wallet minted');
			}) // success
			.catch(err => {
				props.services.emitter.emit('Notify', 'error', 'Transaction failled');
			}) // transaction error
		})
		.catch(err => {
			console.log(err)
			props.services.emitter.emit('Notify', 'error', 'Signature required');
		}) // signature error
		.finally(toggle);
	}

	return (
		<>
			<MDBNavLink to='#!' onClick={toggle}>
				New wallet
			</MDBNavLink>
			<MDBModal isOpen={open} toggle={toggle} centered>
				<MDBModalHeader toggle={toggle}>New wallet</MDBModalHeader>
				<MDBModalBody>
					<form onSubmit={handleSubmit} className='d-flex flex-column'>
						<AddressInputENS className='my-1' label='initial owner' defaultValue={addr} onChange={setAddr} services={props.services}/>
						{ full && <TextField className='my-1' label='seed' defaultValue={seed} onChange={e => setSeed(e.target.value)} variant='outlined'/> }

						<div className='d-flex justify-content-center align-items-center'>
							<Switch size='small' color='primary' checked={full} onChange={toggleFull}/>
							<small className='text-muted'>advanced mode</small>
						</div>

						<MDBBtn color='indigo' type='sumbit' className='mx-0'>Mint</MDBBtn>
					</form>
				</MDBModalBody>
			</MDBModal>
		</>
	);
}

export default MintWallet;
