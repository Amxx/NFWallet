import * as React from 'react';
import { MDBAlert } from 'mdbreact';
import { Spinner  } from 'react-bootstrap';
import { Responsive } from 'responsive-react';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

import WithDetails from './Wallet/WithDetails';
import WalletView  from './Wallet/WalletView';
import WalletView2 from './Wallet/WalletView2';

const WalletResponsive = (props) =>
	<>
		<Responsive displayIn={[ 'Mobile' ]}><WalletView  {...props}/></Responsive>
		<Responsive displayIn={[ 'Tablet' ]}><WalletView  {...props}/></Responsive>
		<Responsive displayIn={[ 'Laptop' ]}><WalletView2 {...props}/></Responsive>
	</>

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
		<>
			{
				loading &&
					<div className='container my-auto'>
						<div className='d-flex justify-content-center'>
							<Spinner animation='grow'>
								<span className='sr-only'>Loading...</span>
							</Spinner>
						</div>
					</div>
			}
			{
				data && !data.wallet &&
					<div className='container my-auto'>
						<MDBAlert color='danger' className='text-center font-weight-bold'>
							No wallet details for { props.routing.match.params.wallet } on { props.services.network.name }
						</MDBAlert>
					</div>
			}
			{
				data && data.wallet &&
					<WithDetails data={data} services={props.services}>
						<WalletResponsive data={data} services={props.services}/>
					</WithDetails>
			}
		</>
	);
}

export default Wallet;
