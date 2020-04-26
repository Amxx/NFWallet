import * as React from 'react';
import {
	MDBTable,
	MDBTableBody,
} from 'mdbreact';
import { ethers } from 'ethers';


const WalletDetails = (props) =>
	<MDBTable responsive borderless small className={props.className}>
		<MDBTableBody>
			<tr>
				<td><strong>Address:</strong></td>
				<td className='text-monospace'>
					<a className='blue-text' href={`${props.services.config.etherscan}/address/${props.data.wallet.id}`} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.getAddress(props.data.wallet.id) }
					</a>
				</td>
			</tr>
			<tr>
				<td><strong>Owner:</strong></td>
				<td className='text-monospace'>
					<a className='blue-text' href={`${props.services.config.etherscan}/address/${props.data.wallet.owner.id}`} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.getAddress(props.data.wallet.owner.id) }
					</a>
				</td>
			</tr>
			<tr>
				<td><strong>TokenID:</strong></td>
				<td className='text-monospace'>
					<a className='blue-text' href={`${props.services.config.opensea}/assets/${props.services.registry.addressPromised}/${ethers.utils.bigNumberify(props.data.wallet.id).toString()}`} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.bigNumberify(props.data.wallet.id).toString() }
					</a>
				</td>
			</tr>
			<tr>
				<td><strong>Balance:</strong></td>
				<td>
					{ props.data.wallet.balance } { ethers.constants.EtherSymbol }
				</td>
			</tr>
		</MDBTableBody>
	</MDBTable>

export default WalletDetails;
