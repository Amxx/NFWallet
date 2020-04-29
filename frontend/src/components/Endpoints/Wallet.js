import * as React from 'react';
import { MDBAlert } from 'mdbreact';
import { Spinner  } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

import WithBalance from './Wallet/WithBalance';
import WalletView  from './Wallet/WalletView';

const Wallet = (props) =>
{
	const { data, loading, error } = useQuery(
		graphql.wallet,
		{
			variables:
			{
				wallet: props.routing.match.params.wallet.toLowerCase(),
			},
			pollInterval: 2000
		}
	)

	if (error) { return `Error! ${error}`; }

	return (
		<div className='container my-auto'>
			{
				loading &&
					<div className='d-flex justify-content-center'>
						<Spinner animation='grow'>
							<span className='sr-only'>Loading...</span>
						</Spinner>
					</div>
			}
			{
				data && !data.wallet &&
					<MDBAlert color='danger' className='text-center font-weight-bold'>
						No wallet details for { props.routing.match.params.wallet } on { props.services.network.name }
					</MDBAlert>
			}
			{
				data && data.wallet &&
					<WithBalance data={data} services={props.services}>
						<WalletView data={data} services={props.services}/>
					</WithBalance>
			}
		</div>
	);
}

export default Wallet;
