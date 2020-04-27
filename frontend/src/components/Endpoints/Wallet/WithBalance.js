import * as React from 'react';
import { ethers } from 'ethers';
import { abi as ABIERC20 } from '../../../abi/ERC20.json';


const WithBalance = (props) =>
{
	const [ balances, setBalances ] = React.useState([]);

	React.useEffect(() => {
		const fetchBalances = () =>
		{
			console.log('fetch balance')
			Promise.all(
				Object.values(props.services.config.exchange.tokens)
				.map(async (token) => {
					const contract = new ethers.Contract(token.address, ABIERC20, props.services.provider.getSigner());
					const amount   = await contract.balanceOf(props.data.wallet.id);
					return { ...token, balance: amount / 10 ** token.decimals };
				})
			).then(tokens => setBalances([
				// eth, symbol→obj
				{
					[ethers.constants.EtherSymbol]:
					{
						symbol:   ethers.constants.EtherSymbol,
						name:     'ether',
						decimals: 18,
						address:  props.services.config.exchange.tokens.WETH.address, // use weth address in uniswap path
						img:      'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
						balance:  Number(props.data.wallet.balance),
					}
				},
				// other tokens, sorted by balance, symbol→obj
				...tokens
				.sort((t1, t2) => t1.balance < t2.balance)
				.map((token) => ({ [token.symbol]: token })),
			].reduce((o1, o2) => ({ ...o1, ...o2 }), {})))
		}
		// trigger and subscribe
		fetchBalances()
		const subscription = props.services.emitter.addListener('tx', fetchBalances);
		return () => subscription.remove();
	}, [props]);

	return <>{ React.Children.map(props.children, child => React.cloneElement(child, { balances })) }</>;
}

export default WithBalance;
