import * as React from 'react';
import { MDBTable, MDBTableBody } from 'mdbreact';
import { ethers } from 'ethers';

import ETHAddress from '../../../UI/ETHAddress';

const WalletDetails = (props) =>
	<MDBTable responsive borderless small className={props.className}>
		<MDBTableBody>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					Address:
				</td>
				<td className='p-1 text-monospace'>
					<a className='blue-text' href={`${props.services.config.etherscan}/address/${props.details.account.address}`} target='_blank' rel='nofollow noopener noreferrer'>
						<ETHAddress address={props.details.account.address} provider={props.services.provider}/>
					</a>
				</td>
			</tr>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					Owner:
				</td>
				<td className='p-1 text-monospace'>
					<a className='blue-text' href={`${props.services.config.etherscan}/address/${props.data.wallet.owner.id}`} target='_blank' rel='nofollow noopener noreferrer'>
						<ETHAddress address={props.data.wallet.owner.id} provider={props.services.provider}/>
					</a>
				</td>
			</tr>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					TokenID:
				</td>
				<td className='p-1 text-monospace'>
					<a className='blue-text' href={
						props.services.config.opensea
						? `${props.services.config.opensea}/assets/${props.details.account.registry}/${ethers.utils.bigNumberify(props.details.account.address).toString()}`
						: `${props.services.config.etherscan}/token/${props.details.account.registry}?a=${ethers.utils.bigNumberify(props.details.account.address).toString()}`
					} target='_blank' rel='nofollow noopener noreferrer'>
						{ ethers.utils.bigNumberify(props.details.account.address).toString() }
					</a>
				</td>
			</tr>
			<tr>
				<td className='py-1 font-weight-bold text-right'>
					Balance:
				</td>
				<td className='py-1'>
					{ ethers.constants.EtherSymbol }&nbsp;{ ethers.utils.formatEther(props.data.wallet.balance) }
				</td>
			</tr>
		</MDBTableBody>
	</MDBTable>

export default WalletDetails;
