import React from 'react';
import {
	MDBIcon,
	MDBNavLink,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
	MDBModalFooter,
} from 'mdbreact';

import TextField       from '@material-ui/core/TextField';
import AccountItem     from '../UI/AccountItem';
import AddressInputENS from '../UI/AddressInputENS';

import { ethers } from 'ethers';
import { abi as ABIFactory } from '../../abi/NFWalletFactory.json';


const HiddenWallet = (props) =>
{
	const factory = new ethers.Contract('nfwallets.eth', ABIFactory, props.provider.getSigner());

	const [ open, setOpen ] = React.useState(false);
	const [ addr, setAddr ] = React.useState(props.accounts[0]);
	const [ seed, setSeed ] = React.useState('');
	const [ pred, setPred ] = React.useState('');
	const toggle = () => setOpen(!open);

	React.useEffect(() => {
		try
		{
			factory.predictWallet(addr, ethers.utils.id(seed)).then(setPred).catch(() => {})
		}
		catch (_)
		{
			setPred('')
		}
	}, [addr, seed]);

	return (
		<>
			<MDBNavLink to='#!' onClick={toggle}>
				Hidden wallet
			</MDBNavLink>
			<MDBModal isOpen={open} toggle={toggle} centered>
				<MDBModalHeader toggle={toggle}>Predict hidden wallet</MDBModalHeader>
				<MDBModalBody>
					<div className='d-flex flex-column justify-content-center'>
						<AddressInputENS className='my-1' label='initial owner' defaultValue={addr} onChange={setAddr} {...props}/>
						<TextField       className='my-1' label='seed'          defaultValue={seed} onChange={e => setSeed(e.target.value)} variant='outlined'/>
						<MDBIcon         className='my-3 text-center' icon='arrow-down'/>
						<AccountItem     className='my-1' name='hidden wallet address' address={pred}/>
					</div>
				</MDBModalBody>
				<MDBModalFooter className='justify-content-center text-justify text-muted'>
					<small>
						This modal will help you predict the address of a NFWallet.
						Given the address of the initial owner and a seed, you can get the address of a wallet that you can use traight away.
						When you finally want to withdraw assets from an hidden wallet, use the advanced options in the “New Wallet” modal.
					</small>
					<small>
						<strong>Be carefull not to lose your seed!</strong>
					</small>
				</MDBModalFooter>
			</MDBModal>
		</>
	);
}

export default HiddenWallet;
