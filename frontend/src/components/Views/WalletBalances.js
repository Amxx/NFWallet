import * as React from 'react';
import TokenItem from '../UI/TokenItem';

import { ethers } from 'ethers';
import { abi as ABIERC20 } from '../../abi/ERC20.json';


const WalletBalances = (props) =>
{
	const [ balances, setBalances ] = React.useState([]);

	React.useEffect(() => {
		Promise.all(
			Object.entries(props.services.config.exchange.tokens)
			.map(async ([ symbol, token ], i) => {
				const contract = new ethers.Contract(token.address, ABIERC20, props.services.provider.getSigner());
				const amount   = await contract.balanceOf(props.data.wallet.id);
				return { symbol, ...token, balance: amount / 10 ** token.decimals };
			})
		).then(tokens => setBalances(tokens.sort((t1, t2) => t1.balance < t2.balance)))
	}, [props])

	return (
		<div className={`d-flex flex-wrap align-items-center justify-content-center ${props.className}`}>
			<TokenItem token={{
				symbol: ethers.constants.EtherSymbol,
				name: 'ether',
				decimals: 18,
				balance: props.data.wallet.balance,
				img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
			}}/>
			{
				balances.map((token, i) => <TokenItem key={i} token={token}/>)
			}
		</div>
	);
}

export default WalletBalances;
