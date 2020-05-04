import * as React from 'react';
import QRCode from 'qrcode.react';
import Grid          from '@material-ui/core/Grid';
import WalletDetails from '../Views/WalletDetails';

const Details = (props) =>
{
	return (
		<Grid container direction='column' justify='center' alignItems='center' className='h-100 p-2'>
			<Grid item>
				<QRCode value={props.details.account.address} size={256} includeMargin/>
			</Grid>
			<Grid item>
				<WalletDetails {...props}/>
			</Grid>
		</Grid>
	);
}

export default Details;
