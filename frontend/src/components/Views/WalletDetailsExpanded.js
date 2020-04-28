import * as React from 'react';
import { MDBCol, MDBRow } from 'mdbreact';
import QRCode from 'qrcode.react';

import WalletDetails from './WalletDetails';

const WalletDetailsExpanded = (props) =>
	<MDBRow className='flex-grow-1 d-flex justify-content-center align-items-center m-0'>
		<MDBCol lg='6' md='12' className='p-0'>
			<div className='d-flex justify-content-center align-items-center p-2'>
				<QRCode value={props.data.wallet.id}/>
			</div>
		</MDBCol>
		<MDBCol lg='6' md='12' className='p-0'>
			<WalletDetails {...props} className='flex-grow-1 m-0'/>
		</MDBCol>
	</MDBRow>

export default WalletDetailsExpanded;
