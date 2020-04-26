import * as React from 'react';
import {
	MDBTable,
	MDBTableBody,
} from 'mdbreact';


const WalletActivity = (props) =>
	<MDBTable responsive borderless small>
		<MDBTableBody>
			{
				props.data.wallet.events.map(event =>
					<tr key={event.id}>
						<td>
							<strong>{event.__typename}</strong>
						</td>
						<td className='text-monospace'>
							<a className='blue-text' href={`${props.services.config.etherscan}/tx/${event.transaction.id}`} target='_blank' rel='nofollow noopener noreferrer'>
								{event.transaction.id.slice(0, 10)}...{event.transaction.id.slice(-8)}
							</a>
						</td>
						<td>
							<small>{ (new Date(Number(event.timestamp)*1000)).toLocaleString() }</small>
						</td>
					</tr>
				)
			}
		</MDBTableBody>
	</MDBTable>

export default WalletActivity;