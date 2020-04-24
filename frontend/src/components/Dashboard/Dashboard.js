import * as React from 'react';
import Grid    from '../UI/Grid';
import Entry   from './Entry';
import graphql from '../../graphql';

const Dashboard = (props) =>
	<div className='m-auto container'>
		<div className='row'>
			<div className='col-md-6'>
				<h1>My Wallets</h1>
				<Grid query={graphql.wallets} component={Entry} variables={{ account: props.accounts[0].toLowerCase() }} {...props}/>
			</div>
			<div className='col-md-6'>
				<h1>All Wallets</h1>
				<Grid query={graphql.walletsAll} component={Entry} {...props}/>
			</div>
		</div>
	</div>;

export default Dashboard;
