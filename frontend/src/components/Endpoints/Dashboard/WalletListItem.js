import * as React from 'react';
import * as EthereumReactComponents from 'ethereum-react-components';
import { Link   } from 'react-router-dom';
import { ethers } from 'ethers';


const WalletListItem = (props) =>
	<Link to={`/wallet/${props.entry.id}`}>
		<EthereumReactComponents.AccountItem
			name    = 'NFWallet'
			address = {props.entry.id}
			balance = {Number(ethers.utils.formatEther(props.entry.balance)).toFixed(6)}
		/>
	</Link>

export default WalletListItem;
