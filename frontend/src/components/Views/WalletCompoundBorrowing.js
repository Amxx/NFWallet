import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import BalanceInput from '../UI/BalanceInput';

import { ethers }   from 'ethers';
import * as utils   from '../../libs/utils'

import CEther       from '../../abi/CEther.json';
import CToken       from '../../abi/CToken.json';


const WalletCompoundBorrowing = (props) =>
{
	const [ borrowable                ] = React.useState(Object.values(props.details.tokens).filter(({compound}) => compound));

	const [ token,      setToken      ] = React.useState(props.details.tokens['ETH']);
	const [ amount,     setAmount     ] = React.useState({});
	const [ limit,      setLimit      ] = React.useState(ethers.constants.Zero);
	const [ enough,     setEnough     ] = React.useState(true);

	React.useEffect(() => {
		setLimit(utils.BNmin(
			token.compound.availableLiquidity,
			props.details.account.compound.accountLiquidity
				.mul(ethers.utils.bigNumberify(10).pow(token.decimals))
				.div(token.compound.assetPrice)
		))
	}, [props, token])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		// if (token.isEth)
		// {
		// 	props.services.emitter.emit('Notify', 'warning', 'Ask Compound to fix their code', 'Not possible to borrow ETH to smart contracts powered wallet');
		// 	return;
		// }

		utils.executeTransactions(
			props.details.account.address,
			[
				[
					token.compound.cTokenAddress,
					ethers.constants.Zero,
					(new ethers.utils.Interface((token.isEth ? CEther : CToken).abi)).functions.borrow.encode([amount.value]),
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

				<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || !props.details.account.isOwner}>
					Borrow {token.symbol} { !props.details.account.isOwner && '(disabled for non owners)' }
				</MDBBtn>

			</form>
		</div>
	);
}

export default WalletCompoundBorrowing;
