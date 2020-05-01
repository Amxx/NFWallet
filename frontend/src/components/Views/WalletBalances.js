import * as React from 'react';
import TokenItem from '../UI/TokenItem';

const WalletBalances = (props) =>
	<div className={`d-flex flex-column align-items-center justify-content-center ${props.className}`}>
		{ Object.values(props.details.tokens).map((token, i) => <TokenItem key={i} token={token}/>) }
	</div>

export default WalletBalances;
