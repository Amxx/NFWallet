import * as React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ethers } from 'ethers';


const WalletCompoundDetails = (props) =>
	<>
		<div>
			<MDBTable responsive small hover>
				<MDBTableHead color='indigo' textWhite>
					<tr>
						<th className='text-center'>Asset</th>
						<th className='text-center'>Balance</th>
						<th className='text-center' colSpan='2'>Deposited</th>
						<th className='text-center' colSpan='2'>Borrowed</th>
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
											token.compound.balance
												.mul(token.compound.exchangeRate)
												.div(ethers.constants.WeiPerEther),
											token.decimals
										))
										.toFixed(3)
									}
								</td>
								<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
									{
										Number(ethers.utils.formatUnits(
											token.compound.balance,
											Number(token.compound.decimals)
										))
										.toFixed(3)
									}
								</td>
								<td className='p-1 text-right'>

								</td>
								<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>

								</td>
							</tr>
						)
					}
				</MDBTableBody>
			</MDBTable>
		</div>
	</>

export default WalletCompoundDetails;
