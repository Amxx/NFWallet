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
	const [ borrowable                ] = React.useState(Object.values(props.details.tokens).filter(({reserveData}) => reserveData));

	const [ stableRate, setStableRate ] = React.useState(false);
	const [ token,      setToken      ] = React.useState('ETH');
	const [ amount,     setAmount     ] = React.useState({});
	const [ limit,      setLimit      ] = React.useState(ethers.constants.Zero);
	const [ enough,     setEnough     ] = React.useState(true);
	const toggleRate = () => setStableRate(!stableRate);

	React.useEffect(() => {
		setLimit(utils.BNmin(
			props.details.tokens[token].reserveData.availableLiquidity, // liquidity
			props.details.account.availableBorrowsETH
			.mul(ethers.constants.WeiPerEther)
			.div(props.details.tokens[token].reserveData.assetPrice) // can be borrowed
		))
	}, [props, token])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset = props.details.tokens[token];
		const value = amount.value;

		utils.executeTransactions(
			props.data.wallet.id,
			[
				[
					pool.address,
					0,
					pool.interface.functions.borrow.encode([
						asset.isEth ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : asset.address,
						value,
						stableRate ? 1 : 2,
						0 // referal code
					])
				]
			]
		);
	}

	return (
		<div className='d-flex justify-content-center align-items-stretch'>
			<div className='d-flex flex-column justify-content-center border-right border-light pr-4 mr-4'>
				{
					borrowable.map(({symbol, img}, i) =>
						<a href='#!' key={i} onClick={() => setToken(symbol)} className='text-center m-2'>
							<img src={img} alt={symbol} height={32}/>
							<div className='text-muted'>
								{symbol}
							</div>
						</a>
					)
				}
			</div>

			<form onSubmit={handleSubmit} className={`flex-grow-1 d-flex flex-column ${props.className}`}>
				<BalanceInput
					className     = 'my-1'
					token         = { token }
					tokenDecimals = { props.details.tokens[token].decimals }
					tokenBalance  = { limit }
					callbacks     = {{ setAmount, setEnough }}
				/>

				<div className='d-flex justify-content-center align-items-center'>
					<span className='text-muted'>variable rate</span>
						<Switch color='primary' checked={stableRate} onChange={toggleRate} disabled/>
					<span className='text-muted'>fixed rate</span>
				</div>

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
					Borrow {token} { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) && '(disabled for non owners)' }
				</MDBBtn>
			</form>
		</div>
	);
}

export default WalletAAVEBorrowing;
