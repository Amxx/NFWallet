import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import { btc } from 'ptokens-utils'

import Grid      from '@material-ui/core/Grid';
import SwapToken from './SwapToken';

import { ethers } from 'ethers';
import * as utils from '../../../../libs/utils'
import PToken     from '../../../../abi/PToken.json';


const Send = (props) =>
{
	const [ token,   setToken   ] = React.useState(props.details.tokens['pBTC']);
	const [ address, setAddress ] = React.useState(ethers.constants.AddressZero);
	const [ amount,  setAmount  ] = React.useState({});
	const [ enough,  setEnough  ] = React.useState(true);


	const handleSend = () =>
	{

		if (!btc.isValidAddress(address.toLowerCase()))
		{
			props.services.emitter.emit('Notify', 'error', 'BTC address is not valid');
			return;
		}
		if (amount.value.lt(50000000000000))
		{
			props.services.emitter.emit('Notify', 'error', 'value to small, withdraws should be at least 0.00005');
			return;
		}

		utils.executeTransactions(
			props.details.account.address,
			[{
				address:  token.address,
				value:    ethers.constants.Zero,
				artefact: PToken,
				method:   'redeem',
				args:     [ amount.value, address.toLowerCase() ],
			}],
			props.services
		);
	}

	return (
		<Grid container direction='row' justify='center' alignItems='stretch' className='h-100 p-2'>

			<Grid item xs={12} sm={10} md={8} lg={6} container direction='column' justify='center' alignItems='center'>
				<Grid item style={{width: '100%'}}>
					<SwapToken
						title      = 'Token to Send'
						token      = {token}
						onChange   = {setToken}
						setAmount  = {setAmount}
						setEnough  = {setEnough}
						setAddress = {setAddress}
						bitcoin
					/>
				</Grid>
				<MDBBtn color='elegant' onClick={handleSend} className='mt-4' disabled={!enough || !props.details.account.isOwner}>
					Send
				</MDBBtn>
			</Grid>

		</Grid>
	);
}

export default Send;
