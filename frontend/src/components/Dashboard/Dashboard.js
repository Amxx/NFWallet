import * as React from 'react';
import WalletList from './WalletList';
import WalletView from './WalletView';


const Dashboard = (props) =>
{
	let classes = 'm-auto container flex-grow-1';
	if (!props.routing.match.params.wallet)
	{
		classes += 'd-flex align-items-center justify-content-center';
	}

	return (
		<div className={classes}>
			<div className='my-5'>
				<WalletList owner={props.accounts[0]} pageSize={props.routing.match.params.wallet ? 5 : 25}/>
			</div>
			{
				props.routing.match.params.wallet &&
				<div className='my-5'>
					<WalletView address={props.routing.match.params.wallet} {...props}/>
				</div>
			}
		</div>
	);
}

export default Dashboard;
