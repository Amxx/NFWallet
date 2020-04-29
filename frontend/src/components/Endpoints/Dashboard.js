import * as React from 'react';
import WalletList from './Dashboard/WalletList';

const Dashboard = (props) =>
	<div className='container my-auto'>
		<WalletList owner={props.services.accounts[0]} pageSize={20} center/>
	</div>

export default Dashboard;
