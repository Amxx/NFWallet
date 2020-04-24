import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

const WalletView = (props) =>
{
	let { data, loading, error } = useQuery(
		graphql.wallet,
		{
			variables:
			{
				wallet: props.address.toLowerCase(),
			},
			pollInterval: 2000
		}
	)

	if (loading) { data = { wallet: null } } // TODO: add a loading icon spinner
	if (error  ) { return `Error! ${error}`; }


	console.log('wallet details:', data.wallet)


	return (
		<div className='alert alert-danger'>
			Comming soon, details and management of wallet {props.address}
		</div>
	);

}

export default WalletView;
