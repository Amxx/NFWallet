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
				<td className='py-1 font-weight-bold text-right'>
					Address:
				</td>
				<td className='p-1 text-monospace'>
					<a className='blue-text' href={`${props.services.config.etherscan}/address/${props.data.wallet.id}`} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.getAddress(props.data.wallet.id) }
					</a>
				</td>
			</tr>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					Owner:
				</td>
				<td className='p-1 text-monospace'>
					<a className='blue-text' href={`${props.services.config.etherscan}/address/${props.data.wallet.owner.id}`} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.getAddress(props.data.wallet.owner.id) }
					</a>
				</td>
			</tr>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					TokenID:
				</td>
				<td className='p-1 text-monospace'>
					<a className='blue-text' href={`${props.services.config.opensea}/assets/${props.services.registry.addressPromised}/${ethers.utils.bigNumberify(props.data.wallet.id).toString()}`} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.bigNumberify(props.data.wallet.id).toString() }
					</a>
				</td>
			</tr>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					Balance:
				</td>
				<td className='py-1'>
					{ ethers.constants.EtherSymbol }&nbsp;{ props.data.wallet.balance }
				</td>
			</tr>
		</MDBTableBody>
	</MDBTable>

export default WalletDetails;
