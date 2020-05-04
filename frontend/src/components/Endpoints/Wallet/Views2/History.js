import * as React from 'react';
import WalletBalanceChart from '../../../Views/WalletBalanceChart';
import WalletActivity     from '../../../Views/WalletActivity';

const History = (props) =>
{
	return (
		<div className='container p-4'>
			<WalletBalanceChart      {...props}/>
			<WalletActivity          {...props}/>
		</div>
	);
}

export default History;
