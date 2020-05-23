import React from 'react';
import { MDBBtn         } from 'mdbreact';
import { MDBNavLink     } from 'mdbreact';
import { MDBModal       } from 'mdbreact';
import { MDBModalHeader } from 'mdbreact';
import { MDBModalBody   } from 'mdbreact';
import TextField          from '@material-ui/core/TextField';
import AddressInputETH    from '../UI/AddressInputETH';
import Switch             from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'
import NFWalletFactory from '../../abi/NFWalletFactory.json';


const MintWallet = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const [ full, setFull ] = React.useState(!!props.advanced);
	const [ addr, setAddr ] = React.useState(null);
	const [ user, setUser ] = React.useState(null);
	const [ seed, setSeed ] = React.useState('');
	const toggle     = () => setOpen(!open);
	const toggleFull = () => setFull(!full);

	React.useEffect(() => {
		props.services.provider.lookupAddress(props.services.accounts[0])
		.then(setUser)
		.catch(() => setUser(props.services.accounts[0]))
	}, [props.services]);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		utils.executePromise(
			(new ethers.Contract(NFWalletFactory.networks[props.services.network.chainId].address, NFWalletFactory.abi, utils.getSigner(props.services)))
			.createWallet(
				addr,
				full ? ethers.utils.id(seed) : ethers.utils.randomBytes(32),
			),
			props.services
		)
		.then(toggle);
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
						<AddressInputETH
							className='my-1'
							label='initial owner'
							defaultValue={user}
							onChange={setAddr}
							provider={props.services.provider}
						/>

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
