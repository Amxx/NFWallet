import * as React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import {
	MDBAlert,
	MDBCard,
	MDBCardTitle,
	MDBCardBody,
	MDBCol,
	MDBRow,
} from 'mdbreact';
import { Spinner } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

import WalletActivity        from '../Views/WalletActivity';
import WalletBalances        from '../Views/WalletBalances';
import WalletBalanceChart    from '../Views/WalletBalanceChart';
import WalletDetailsExpanded from '../Views/WalletDetailsExpanded';
import WalletTrade           from '../Views/WalletTrade';
import WalletTX              from '../Views/WalletTX';



const ExpansionWrapper = (props) =>
	<ExpansionPanel className='m-2 mb-3'>
		<ExpansionPanelSummary>
			{ props.title }
		</ExpansionPanelSummary>
		<ExpansionPanelDetails className={props.center && 'd-flex justify-content-center align-items-center'}>
			{ props.children }
		</ExpansionPanelDetails>
	</ExpansionPanel>

const CardWrapper = (props) =>
	<MDBCard className='m-2 mb-3'>
		<MDBCardBody className={props.center && 'd-flex justify-content-center align-items-center'}>
			{ props.title && <MDBCardTitle>{ props.title }</MDBCardTitle> }
			{ props.title && <hr className='hr-grey'/> }
			{ props.children }
		</MDBCardBody>
	</MDBCard>



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
		<div className={`container ${!(data && data.wallet) && 'my-auto'}`}>
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
						<MDBCol size='12' className='p-0'>

							<CardWrapper>
								<WalletDetailsExpanded
									data={data}
									services={props.services}
								/>
							</CardWrapper>

						</MDBCol>
						</MDBRow>
						<MDBRow className='flex-row-reverse'>
						<MDBCol lg='6' md='12' className='p-0'>

							<CardWrapper title='Send Ether'>
								<WalletTX
									data={data}
									services={props.services}
								/>
							</CardWrapper>

							<CardWrapper title='Exchange'>
								<WalletTrade
									data={data}
									services={props.services}
								/>
							</CardWrapper>

						</MDBCol>
						<MDBCol lg='6' md='12' className='p-0'>

							<CardWrapper title='Balances'>
								<WalletBalances
									data={data}
									services={props.services}
								/>
							</CardWrapper>

							<CardWrapper title='Balance chart'>
								<WalletBalanceChart
									data={data}
									services={props.services}
									/>
							</CardWrapper>

							<CardWrapper title='Activity logs'>
								<WalletActivity
									data={data}
									services={props.services}
								/>
							</CardWrapper>

						</MDBCol>
						</MDBRow>
					</>
			}
		</div>
	);
}

export default Wallet;
