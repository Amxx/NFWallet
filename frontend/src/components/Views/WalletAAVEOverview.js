import * as React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import { ethers } from 'ethers';


const WalletAAVEOverview = (props) =>
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
				Object.values(props.details.tokens).filter(({aave}) => aave).map((token, i) =>
					<tr key={i}>
						<td className='py-1 text-center'>
							<img src={token.img} height={32} alt={token.symbol}/>
						</td>
						<td className='p-1 text-center'>
							{ Number(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(3) }
						</td>
						<td className='p-1 text-right'>
							{ Number(ethers.utils.formatUnits(token.aave.aTokenBalance, token.decimals)).toFixed(3) }
						</td>
						<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
							{ Number(ethers.utils.formatUnits(token.aave.liquidityRate, 25)).toFixed(2) }% APY
						</td>
						<td className='p-1 text-right'>
							{ Number(ethers.utils.formatUnits(token.aave.borrowBalance, token.decimals)).toFixed(3) }
						</td>
						<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
							{ Number(ethers.utils.formatUnits(token.aave.borrowRate, 25)).toFixed(2) }% APY
						</td>
						<td className='p-1 text-center'>
							{ Number(ethers.utils.formatUnits(token.aave.availableLiquidity, token.decimals)).toFixed(3) }
						</td>
					</tr>
				)
			}
		</MDBTableBody>
	</MDBTable>

export default WalletAAVEOverview;
