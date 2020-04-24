import * as React from 'react';
import WalletList from './WalletList';
import WalletView from './WalletView';


const Dashboard = (props) =>
{
	return (
		<div className='m-auto container flex-grow-1'>
			<div className='my-5'>
				<WalletList owner={props.accounts[0]}/>
			</div>
			<div className='my-5'>
				{
					props.routing.match.params.wallet && <WalletView address={props.routing.match.params.wallet} {...props}/>
				}
			</div>
		</div>
	);
}

export default Dashboard;
