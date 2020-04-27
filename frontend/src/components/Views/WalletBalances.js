import * as React from 'react';
import TokenItem from '../UI/TokenItem';

import { ethers } from 'ethers';
import { abi as ABIERC20 } from '../../abi/ERC20.json';


const WalletBalances = (props) =>
{
	const [ balances, setBalances ] = React.useState([]);

	React.useEffect(() => {
		const fetchBalances = () =>
		{
			Promise.all(
				Object.values(props.services.config.exchange.tokens)
				.map(async (token, i) => {
					const contract = new ethers.Contract(token.address, ABIERC20, props.services.provider.getSigner());
					const amount   = await contract.balanceOf(props.data.wallet.id);
					return { ...token, balance: amount / 10 ** token.decimals };
				})
			).then(tokens => setBalances(tokens.sort((t1, t2) => t1.balance < t2.balance)))
		}
		// trigger and subscribe
		fetchBalances()
		const subscription = props.services.emitter.addListener('tx', fetchBalances);
		return () => subscription.remove();
	}, [props]);

	return (
		<div className={`d-flex flex-column align-items-center justify-content-center ${props.className}`}>
			<TokenItem token={{
				symbol:   ethers.constants.EtherSymbol,
				name:     'ether',
				decimals: 18,
				img:      'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
				balance:  props.data.wallet.balance,
			}}/>
			{
				balances.map((token, i) => <TokenItem key={i} token={token}/>)
			}
		</div>
	);
}

export default WalletBalances;
