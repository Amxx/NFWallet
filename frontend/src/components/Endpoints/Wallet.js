import * as React from 'react';
import * as EthereumReactComponents from 'ethereum-react-components';
import { Spinner } from 'react-bootstrap';
import {
	MDBRow,
	MDBCol,
	MDBAlert,
	MDBCard,
	MDBCardTitle,
	MDBCardBody,
} from 'mdbreact';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

import Masonry            from 'react-masonry-component';
import WalletBalanceChart from '../Views/WalletBalanceChart';
import WalletDetails      from '../Views/WalletDetails';
import WalletActivity     from '../Views/WalletActivity';


const CardWapper = (props) =>
	<MDBCol size={props.size || '6'} className={`p-2 ${props.className}`}>
		<MDBCard>
			<MDBCardBody className={ props.center && 'd-flex justify-content-center align-items-center'}>
				{ props.title && <MDBCardTitle>{props.title}</MDBCardTitle> }
				{ props.title && <hr className='hr-grey'/> }
				{ props.children }
			</MDBCardBody>
		</MDBCard>
	</MDBCol>

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
		<div className='container my-auto text-center'>
			{
				loading &&
					<Spinner animation='grow'>
						<span className='sr-only'>Loading...</span>
					</Spinner>
			}
			{
				data && !data.wallet &&
					<MDBAlert color='danger' className='text-center font-weight-bold'>
						No wallet details for { props.routing.match.params.wallet } on { props.services.network.name }
					</MDBAlert>
			}
			{
				data && data.wallet &&
					<>
						<MDBRow>
							<CardWapper size='12' center>
								<div className='pt-3'>
									<EthereumReactComponents.AccountItem
										name    = 'NFWallet'
										address = {data.wallet.id}
										balance = {data.wallet.balance}
									/>
								</div>
							</CardWapper>
						</MDBRow>
						<Masonry className='row'>
							<CardWapper size='6' title='Details'      ><WalletDetails      data={data} services={props.services}/></CardWapper>
							<CardWapper size='6' title='Balance chart'><WalletBalanceChart data={data} services={props.services}/></CardWapper>
							<CardWapper size='6' title='Activity logs'><WalletActivity     data={data} services={props.services}/></CardWapper>
						</Masonry>
					</>
			}
		</div>
	);
}

export default Wallet;
