import * as React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ethers } from 'ethers';


// Liquidity: { ethers.utils.formatUnits(props.details.account.compound.accountLiquidity, 36) }
// Shortfall: { ethers.utils.formatUnits(props.details.account.compound.shortfall,        36) }
const WalletCompoundOverview = (props) =>
	<MDBTable responsive small hover>
		<MDBTableHead color='indigo' textWhite>
			<tr>
				<th className='text-center'>Asset</th>
				<th className='text-center'>Balance</th>
				<th className='text-center' colSpan='2'>Deposited</th>
				<th className='text-center' colSpan='2'>Borrowed</th>
				<th className='text-center'>Available liquidity</th>
			</tr>
		</MDBTableHead>
		<MDBTableBody>
			{
				Object.values(props.details.tokens).filter(({compound}) => compound).map((token, i) =>
					<tr key={i}>
						<td className='py-1 text-center'>
							<img src={token.img} height={32} alt={token.symbol}/>
						</td>
						<td className='p-1 text-center'>
							{ Number(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(3) }
						</td>
						<td className='p-1 text-right'>
							{
								Number(ethers.utils.formatUnits(
									token.compound.cTokenBalance
										.mul(token.compound.exchangeRateStored)
										.div(ethers.constants.WeiPerEther),
									token.decimals
								))
								.toFixed(3)
							}
						</td>
						<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
							{
								Number(ethers.utils.formatUnits(
									token.compound.cTokenBalance,
									Number(token.compound.cTokenDecimals)
								))
								.toFixed(3)
							}
						</td>
						<td className='p-1 text-right'>
							{
								Number(ethers.utils.formatUnits(
									token.compound.borrowBalance,
									token.decimals
								))
								.toFixed(3)
							}
						</td>
						<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
							{
								(((1 + (token.compound.borrowRatePerBlock / 10**18)) ** 2254114 - 1) * 100).toFixed(3)
							}% APY
						</td>
						<td className='p-1 text-center'>
							{ Number(ethers.utils.formatUnits(token.compound.availableLiquidity, token.decimals)).toFixed(3) }
						</td>
					</tr>
				)
			}
		</MDBTableBody>
	</MDBTable>

export default WalletCompoundOverview;
