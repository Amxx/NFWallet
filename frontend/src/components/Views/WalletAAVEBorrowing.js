import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';
import Switch       from '@material-ui/core/Switch';

import { ethers }      from 'ethers';
import * as utils      from '../../libs/utils'

import LendingPool     from '../../abi/LendingPool.json';


const WalletAAVEBorrowing = (props) =>
{
	const [ pool                      ] = React.useState(new ethers.Contract(LendingPool.networks[props.services.network.chainId].address, LendingPool.abi, props.services.provider.getSigner()));
	const [ borrowable                ] = React.useState(Object.values(props.details.tokens).filter(({aave}) => aave));

	const [ stableRate, setStableRate ] = React.useState(false);
	const [ token,      setToken      ] = React.useState(props.details.tokens['ETH']);
	const [ amount,     setAmount     ] = React.useState({});
	const [ limit,      setLimit      ] = React.useState(ethers.constants.Zero);
	const [ enough,     setEnough     ] = React.useState(true);
	const toggleRate = () => setStableRate(!stableRate);

	React.useEffect(() => {
		setLimit(utils.BNmin(
			token.aave.availableLiquidity, // liquidity
			props.details.account.aave.availableBorrowsETH
			.mul(ethers.constants.WeiPerEther)
			.div(token.aave.assetPrice) // can be borrowed
		))
	}, [props, token])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const value = amount.value;

		utils.executeTransactions(
			props.data.wallet.id,
			[
				[
					pool.address,
					0,
					pool.interface.functions.borrow.encode([
						token.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : token.address,
						value,
						stableRate ? 1 : 2,
						0 // referal code
					])
				]
			],
			props.services
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					borrowable.map((token, i) =>
						<a href='#!' key={i} onClick={() => setToken(token)} className='text-center m-2'>
							<img src={token.img} alt={token.symbol} height={32}/>
							<div className='text-muted'>
								{token.symbol}
							</div>
						</a>
					)
				}
			</div>

			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column justify-content-center ${props.className}`}>

				<BalanceInput
					className     = 'my-1'
					token         = { token.symbol }
					tokenDecimals = { token.decimals }
					tokenBalance  = { limit }
					callbacks     = {{ setAmount, setEnough }}
				/>

				<div className='d-flex justify-content-center align-items-center'>
					<small className='text-muted'>variable rate</small>
						<Switch size='small' color='primary' checked={stableRate} onChange={toggleRate} disabled/>
					<small className='text-muted'>fixed rate</small>
				</div>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner}>
					Borrow {token.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
				</MDBBtn>

			</form>
		</div>
	);
}

export default WalletAAVEBorrowing;
