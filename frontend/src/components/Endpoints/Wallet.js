import * as React from 'react';
import WalletView from '../Views/WalletView';


const Wallet = (props) =>
	<div className='container my-auto'>
			<WalletView address={props.routing.match.params.wallet} services={props.services}/>
	</div>

export default Wallet;
