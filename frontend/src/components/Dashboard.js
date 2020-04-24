import * as React from 'react';

import Grid    from './UI/Grid';
import Token   from './Token';

import graphql from '../graphql';

// import { ethers } from 'ethers';
// import { abi as ABIFactory } from '../abi/NFWalletFactory.json';
// import { abi as ABIWallet  } from '../abi/NFWallet.json';

const Dashboard = (props) =>
	<div className='m-auto container'>
		<div className='row'>
			<div className='col-md-6'>
				<h1>My Wallets</h1>
				<Grid query={graphql.wallets} component={Token} variables={{ account: props.accounts[0].toLowerCase() }} {...props}/>
			</div>
			<div className='col-md-6'>
				<h1>All Wallets</h1>
				<Grid query={graphql.walletsAll} component={Token} {...props}/>
			</div>
		</div>
	</div>;

export default Dashboard;
