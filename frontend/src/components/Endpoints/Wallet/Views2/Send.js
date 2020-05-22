import * as React from 'react';
import { MDBBtn } from 'mdbreact';

import Grid      from '@material-ui/core/Grid';
import SwapToken from './SwapToken';

import { ethers } from 'ethers';
import * as utils from '../../../../libs/utils'
import ERC20      from '../../../../abi/ERC20.json';


const Send = (props) =>
{
	const [ tokens              ] = React.useState(Object.values(props.details.tokens));
	const [ token,   setToken   ] = React.useState(props.details.tokens['ETH']);
	const [ address, setAddress ] = React.useState(ethers.constants.AddressZero);
	const [ amount,  setAmount  ] = React.useState({});
	const [ enough,  setEnough  ] = React.useState(true);


	const handleSend = () =>
	{
		utils.executeTransactions(
			props.details.account.address,
			[{
				address:  token.isEth ? address : token.address,
				value:    token.isEth  && amount.value,
				artefact: !token.isEth && ERC20,
				method:   !token.isEth && 'transfer',
				args:     !token.isEth && [ address, amount.value ],
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
						tokenList  = {tokens}
						onChange   = {setToken}
						setAmount  = {setAmount}
						setEnough  = {setEnough}
						setAddress = {setAddress}
						services   = {props.services}
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
