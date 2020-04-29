import * as React from 'react';
import graphql    from '../../graphql';

import Grid          from './Overview/Grid';
import GrigItemToken from './Overview/GrigItemToken';


const Overview = (props) =>
	<div className='m-auto container'>
		<div className='row'>
			<div className='col-md-6'>
				<h1>My Wallets</h1>
				<Grid
					query     = {graphql.wallets}
					services  = {props.services}
					component = {GrigItemToken}
					variables = {{account: props.services.accounts[0].toLowerCase()}}
					/>
			</div>
			<div className='col-md-6'>
				<h1>All Wallets</h1>
				<Grid
					query     = {graphql.walletsAll}
					services  = {props.services}
					component = {GrigItemToken}
				/>
			</div>
		</div>
	</div>;

export default Overview;
