import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';

import ERC20           from '../../../abi/ERC20.json';
import LendingPoolCore from '../../../abi/LendingPoolCore.json';
import AToken          from '../../../abi/AToken.json';


const WithBalance = (props) =>
{
	const [ balances, setBalances ] = React.useState(null);

	React.useEffect(() => {
		const fetchBalances = () =>
		{
			Promise.all(
				Object.values(props.services.config.exchange.tokens)
				.map(async (token) => {
					let extra;
					try
					{
						const poolcore = new ethers.Contract(LendingPoolCore.networks[props.services.network.chainId].address, LendingPoolCore.abi, props.services.provider.getSigner());
						const aAddress = await poolcore.getReserveATokenAddress(token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address);
						const aToken   = new ethers.Contract(aAddress, AToken.abi, props.services.provider.getSigner());
						const aBalance = await aToken.balanceOf(props.data.wallet.id);
						extra = { aAddress, aBalance: aBalance / 10 ** token.decimals };
					}
					catch
					{
						extra = {}
					}
					finally
					{
						if (token.isEth)
						{
							return { ...token, ...extra, balance: props.data.wallet.balance / 10 ** token.decimals };
						}
						else
						{
							const contract = new ethers.Contract(token.address, ERC20.abi, props.services.provider.getSigner());
							const amount   = await contract.balanceOf(props.data.wallet.id);
							return { ...token, ...extra, balance: amount / 10 ** token.decimals };
						}
					}
				})
			).then(tokens => setBalances(
				tokens
					.sort((t1, t2) => !t1.isEth && (t2.isEth || t1.balance < t2.balance)) // with ether, then by balance
					.reduce((acc, token) => ({ ...acc, [token.symbol]: token }), {})
			))
		}
		// trigger and subscribe
		fetchBalances()
		const subscription = props.services.emitter.addListener('tx', fetchBalances);
		return () => subscription.remove();
	}, [props]);

	return <>
		{  balances && React.Children.map(props.children, child => React.cloneElement(child, { balances })) }
		{ !balances && <div className='d-flex justify-content-center'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div> }
	</>;
}

export default WithBalance;
