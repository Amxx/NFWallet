import * as React from 'react';
import WalletList from './Dashboard/WalletList';


const Dashboard = (props) =>
	<div className='container my-auto text-center'>
		<h1 className='mb-5'>My Wallets</h1>
		<WalletList owner={props.services.accounts[0]} pageSize={20} center/>
	</div>

export default Dashboard;
