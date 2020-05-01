import * as React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ethers } from 'ethers';


const WalletAAVEDetails = (props) =>
	<>
		<div className='mb-2'>
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
						Object.values(props.details.tokens).filter(({reserveData}) => reserveData).map((token, i) =>
							<tr key={i}>
								<td className='py-1 text-center'>
									<img src={token.img} height={32} alt={token.symbol}/>
								</td>
								<td className='p-1 text-center'>
									{ Number(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(6) }
								</td>
								<td className='p-1 text-right'>
									{ Number(ethers.utils.formatUnits(token.reserveData.aTokenBalance, token.decimals)).toFixed(6) }
								</td>
								<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
									{ Number(ethers.utils.formatUnits(token.reserveData.liquidityRate, 25)).toFixed(2) }% APY
								</td>
								<td className='p-1 text-right'>
									{ Number(ethers.utils.formatUnits(token.reserveData.borrowBalance, token.decimals)).toFixed(6) }
								</td>
								<td className='p-1 text-left text-muted' style={{fontSize: '.6em'}}>
									{ Number(ethers.utils.formatUnits(token.reserveData.borrowRate, 25)).toFixed(2) }% APY
								</td>
							</tr>
						)
					}
				</MDBTableBody>
			</MDBTable>
		</div>
		<div className='mt-2'>
			<MDBTable responsive borderless small>
				<MDBTableHead color='indigo' textWhite>
					<tr>
						<th className='text-center' colSpan='2'>Position</th>
					</tr>
				</MDBTableHead>
				<MDBTableBody>
					<tr>
						<td className='pt-4 pb-2' colSpan='2'>
							<LinearProgress
								variant     = 'buffer'
								value       = {Number(props.details.account.totalBorrowsETH.mul(100).div(props.details.account.totalCollateralETH))}
								valueBuffer = {Number(props.details.account.totalBorrowsETH.add(props.details.account.availableBorrowsETH).mul(100).div(props.details.account.totalCollateralETH))}
								style       = {{ height: '1em' }}
							/>
						</td>
					</tr>
					<tr>
						<td className='py-1 font-weight-bold'>
							Collateral (eq { ethers.constants.EtherSymbol })
						</td>
						<td className='p-1 text-right'>
							{ Number(ethers.utils.formatEther(props.details.account.totalCollateralETH)).toFixed(9) }
						</td>
					</tr>
					<tr>
						<td className='py-1 font-weight-bold'>
							Borrowed (eq { ethers.constants.EtherSymbol })
						</td>
						<td className='p-1 text-right'>
							{ Number(ethers.utils.formatEther(props.details.account.totalBorrowsETH)).toFixed(9) }
						</td>
					</tr>
					<tr>
						<td className='py-1 font-weight-bold'>
							Available (eq { ethers.constants.EtherSymbol })
						</td>
						<td className='p-1 text-right'>
							{ Number(ethers.utils.formatEther(props.details.account.availableBorrowsETH)).toFixed(9) }
						</td>
					</tr>
				</MDBTableBody>
			</MDBTable>
		</div>
	</>

export default WalletAAVEDetails;
