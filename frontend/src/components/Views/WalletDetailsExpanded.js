import * as React from 'react';
import * as EthereumReactComponents from 'ethereum-react-components';
import {
	MDBCol,
	MDBRow,
} from 'mdbreact';
import WalletDetails from './WalletDetails';


const WalletDetailsExpanded = (props) =>
	<MDBRow className='flex-grow-1 d-flex justify-content-center align-items-center m-0'>
		<MDBCol lg='6' md='12' className='p-0'>
			<div className='d-flex justify-content-center align-items-center p-0 pt-2'>
				<EthereumReactComponents.AccountItem
					name    = 'NFWallet'
					address = {props.data.wallet.id}
					balance = {props.data.wallet.balance}
				/>
			</div>
		</MDBCol>
		<MDBCol lg='6' md='12' className='p-0'>
			<WalletDetails data={props.data} services={props.services} className='flex-grow-1 m-0'/>
		</MDBCol>
	</MDBRow>

export default WalletDetailsExpanded;
