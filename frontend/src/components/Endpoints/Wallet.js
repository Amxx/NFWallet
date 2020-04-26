import * as React from 'react';
import * as EthereumReactComponents from 'ethereum-react-components';
import { Spinner } from 'react-bootstrap';
import {
	MDBAlert,
	MDBCard,
	MDBCardTitle,
	MDBCardBody,
	MDBCol,
	MDBRow,
} from 'mdbreact';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

import Masonry from 'react-masonry-component';
import WalletTX           from '../Views/WalletTX';
import WalletDetails      from '../Views/WalletDetails';
import WalletActivity     from '../Views/WalletActivity';
import WalletBalanceChart from '../Views/WalletBalanceChart';



const CardWapper = (props) =>
	<MDBCol
		bottom    = {props.bottom}
		className = {'p-2 '+props.className}
		lg        = {props.lg}
		md        = {props.md}
		size      = {props.size}
		sm        = {props.sm}
		middle    = {props.middle}
		top       = {props.top}
		xl        = {props.xl}
		x         = {props.x}
	>
		<MDBCard>
			<MDBCardBody className={props.center && 'd-flex justify-content-center align-items-center'}>
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
							<CardWapper className='masonry-item' lg='6' md='12' title='Send'         ><WalletTX           data={data} services={props.services}/></CardWapper>
							<CardWapper className='masonry-item' lg='6' md='12' title='Details'      ><WalletDetails      data={data} services={props.services}/></CardWapper>
							<CardWapper className='masonry-item' lg='6' md='12' title='Balance chart'><WalletBalanceChart data={data} services={props.services}/></CardWapper>
							<CardWapper className='masonry-item' lg='6' md='12' title='Activity logs'><WalletActivity     data={data} services={props.services}/></CardWapper>
						</Masonry>
					</>
			}
		</div>
	);
}

export default Wallet;
