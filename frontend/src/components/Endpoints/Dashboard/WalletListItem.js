import * as React from 'react';
import { Link   } from 'react-router-dom';
import AccountItem from '../../UI/AccountItem';
import { ethers } from 'ethers';


const WalletListItem = (props) =>
	<Link to={`/wallet/${props.entry.id}`}>
		<AccountItem
			name    = 'NFWallet'
			address = {props.entry.id}
			balance = {Number(ethers.utils.formatEther(props.entry.balance)).toFixed(6)}
			short
		/>
	</Link>

export default WalletListItem;
