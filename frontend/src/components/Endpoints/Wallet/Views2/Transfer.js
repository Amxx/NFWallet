import * as React from 'react';
import { MDBBtn } from 'mdbreact';

import Grid      from '@material-ui/core/Grid';
import SwapToken from './SwapToken';

import { ethers }      from 'ethers';
import * as utils      from '../../../../libs/utils'
import NFWalletFactory from '../../../../abi/NFWalletFactory.json';

import icon from '../../../../assets/nfw-logo-03.svg'


const Send = (props) =>
{
	const [ address, setAddress ] = React.useState(ethers.constants.AddressZero);

	const handleTransfer = () =>
	{
		utils.executePromise(
			(new ethers.Contract(props.details.account.registry, NFWalletFactory.abi, utils.getSigner(props.services))).transferFrom(props.data.wallet.owner.id, address, props.details.account.address),
			props.services
		);
	}

	return (
		<Grid container direction='row' justify='center' alignItems='stretch' className='h-100 p-2'>
			<Grid item xs={12} sm={10} md={8} lg={6} container direction='column' justify='center' alignItems='center'>
				<Grid item style={{width: '100%'}}>
					<SwapToken
						title      = 'Transfer this wallet'
						token      = {{ img: icon, symbol: 'NFWallet', balance: ethers.constants.One, decimals: 0}}
						tokenList  = {[]}
						setAddress = {setAddress}
						services   = {props.services}
						noValue
					/>
				</Grid>
				<MDBBtn color='elegant' onClick={handleTransfer} className='mt-4' disabled={!props.details.account.isOwner}>
					Transfer
				</MDBBtn>
			</Grid>
		</Grid>
	);
}

export default Send;
