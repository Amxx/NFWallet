import * as React from 'react';
import { ethers } from 'ethers';
import { abi as ABIERC20 } from '../../../abi/ERC20.json';


const WithBalance = (props) =>
{
	const [ balances, setBalances ] = React.useState([]);

	React.useEffect(() => {
		const fetchBalances = () =>
		{
			Promise.all(
				Object.values(props.services.config.exchange.tokens)
				.map(async (token) => {
					if (token.symbol === ethers.constants.EtherSymbol)
					{
						return { ...token, balance: props.data.wallet.balance / 10 ** token.decimals };
					}
					else
					{
						const contract = new ethers.Contract(token.address, ABIERC20, props.services.provider.getSigner());
						const amount   = await contract.balanceOf(props.data.wallet.id);
						return { ...token, balance: amount / 10 ** token.decimals };
					}
				})
			).then(tokens => setBalances(
				tokens
					.sort((t1, t2) => t2.symbol === ethers.constants.EtherSymbol || t1.balance < t2.balance) // with ether, then by balance
					.map((token) => ({ [token.symbol]: token }))
					.reduce((o1, o2) => ({ ...o1, ...o2 }), {}))
			)
		}
		// trigger and subscribe
		fetchBalances()
		const subscription = props.services.emitter.addListener('tx', fetchBalances);
		return () => subscription.remove();
	}, [props]);

	return <>{ React.Children.map(props.children, child => React.cloneElement(child, { balances })) }</>;
}

export default WithBalance;
