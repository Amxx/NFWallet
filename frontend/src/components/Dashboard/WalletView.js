import * as React from 'react';
import { MDBAlert } from 'mdbreact';
import * as EthereumReactComponents from 'ethereum-react-components';
import { ethers } from 'ethers';
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

	if (error) { return `Error! ${error}`; }

	const admin = data && data.wallet.owner.id === props.accounts[0].toLowerCase();

	return (
		loading
		?
			<p className='text-center text-muted'>Loading...</p>
		:
			data.wallet
		?
			<MDBAlert color={ admin ? 'success' : 'secondary' }>

				<h2 className='text-center mb-3'>This board is still work in progress</h2>

				<div className='d-flex flex-wrap justify-content-center align-items-center'>
					<EthereumReactComponents.AccountItem
						name    = 'NFWallet'
						address = {data.wallet.id}
						balance = {data.wallet.balance}
					/>
				</div>

				<h3>Details</h3>
				<ul>
					<li key='owner'>
						<strong>Owner:</strong>
						<a href={`https://rinkeby.etherscan.io/address/${data.wallet.owner.id}`} target='_blank' rel='nofollow noopener noreferrer'>
							{ ethers.utils.getAddress(data.wallet.owner.id) }
						</a>
					</li>
					<li key='address'>
						<strong>Address:</strong>
						<a href={`https://rinkeby.etherscan.io/address/${data.wallet.id}`} target='_blank' rel='nofollow noopener noreferrer'>
							{ ethers.utils.getAddress(data.wallet.id) }
						</a>
					</li>
					<li key='tokenid'>
						<strong>TokenID:</strong>
						<a href={`https://rinkeby.opensea.io/assets/${props.registry.addressPromised}/${ethers.utils.bigNumberify(data.wallet.id).toString()}`} target='_blank' rel='nofollow noopener noreferrer'>
							{ ethers.utils.bigNumberify(data.wallet.id).toString() }
						</a>
					</li>
					<li key='balance'>
						<strong>Balance:</strong> { data.wallet.balance } { ethers.constants.EtherSymbol }
					</li>
				</ul>
				<h3>History</h3>
				<ul>
				{
					data.wallet.events.map(event =>
						<li key={event.id}>
							<a href={`https://rinkeby.etherscan.io/tx/${event.transaction.id}`} target='_blank' rel='nofollow noopener noreferrer'>
								<strong>[{event.__typename}]</strong>
							</a>
							<small>
								{ (new Date(Number(event.timestamp)*1000)).toLocaleString() }
							</small>
						</li>
					)
				}
				</ul>

			</MDBAlert>
		:
			<MDBAlert color='danger' className='text-center font-weight-bold'>
				No wallet details for { props.address } on { props.network.name }
			</MDBAlert>
	);
}

export default WalletView;
