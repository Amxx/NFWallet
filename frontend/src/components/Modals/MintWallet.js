import React from 'react';
import {
	MDBBtn,
	MDBNavLink,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
} from 'mdbreact';

import TextField from '@material-ui/core/TextField';
import AddressInputENS from '../UI/AddressInputENS';

import { ethers } from 'ethers';
import { abi as ABIFactory } from '../../abi/NFWalletFactory.json';

const MintWallet = (props) =>
{
	const factory = new ethers.Contract('nfwallets.eth', ABIFactory, props.provider.getSigner());

	const [ open, setOpen ] = React.useState(false);
	const [ full, setFull ] = React.useState(!!props.advanced);
	const [ addr, setAddr ] = React.useState(props.accounts[0]);
	const [ seed, setSeed ] = React.useState('');
	const toggle     = () => setOpen(!open);
	const toggleFull = () => setFull(!full);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();
		factory.createWallet(
			addr,
			full ? ethers.utils.id(seed) : ethers.utils.randomBytes(32),
		)
		.then(txPromise => {
			txPromise.wait()
			.then(() => {}) // success
			.catch(() => {}) // transaction error
		})
		.catch(() => {}) // signature error
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
					{
						full
						?
							<form onSubmit={handleSubmit} className='d-flex flex-column'>
								<AddressInputENS className='my-1' label='initial owner' defaultValue={addr} onChange={setAddr}                                         {...props}/>
								<TextField       className='my-1' label='seed'          defaultValue={seed} onChange={e => setSeed(e.target.value)} variant='outlined' {...props}/>
								<MDBBtn color='indigo' type='sumbit' className='mx-0'>Mint</MDBBtn>
							</form>
						:
							<form onSubmit={handleSubmit} className='d-flex'>
								<AddressInputENS className='flex-grow-1' label='initial owner' defaultValue={addr} onChange={setAddr} {...props}/>
								<MDBBtn color='indigo' type='sumbit' className='my-0'>Mint</MDBBtn>
							</form>
					}
					<div className='lined text-muted'>
						<a href='#!' className='text-reset' onClick={toggleFull}>
							toggle advanced mode
						</a>
					</div>
				</MDBModalBody>
			</MDBModal>
		</>
	);
}

export default MintWallet;
