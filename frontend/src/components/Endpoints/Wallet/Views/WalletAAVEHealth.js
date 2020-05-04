import * as React from 'react';
import { MDBTable, MDBTableBody } from 'mdbreact';
import Grid  from '@material-ui/core/Grid';
import Chart from 'react-apexcharts';

import { ethers } from 'ethers';


const options = {
	chart: {
		type:    'radialBar',
		height:  200,
		toolbar: { show: false }
	},
	plotOptions: {
		radialBar: {
			startAngle: -135,
			endAngle: 135,
			dataLabels: {
				name:  { fontSize: '1.2em', offsetY:  8 },
				value: { fontSize: '1.0em', offsetY: 35 },
			}
		},
	}
};


const WalletAAVEHealthWrapper = (props) =>
	props.details.account.aave.totalCollateralETH.gt(0)
	? <WalletAAVEHealth {...props}/>
	: <div className='text-center text-muted'>This wallet doesn't have any AAVE assets</div>

const WalletAAVEHealth = (props) =>
{
	const ratio = props.details.account.aave.totalBorrowsETH.mul(100).div(props.details.account.aave.totalCollateralETH);
	const [ label, color ] =
		  ratio.lt(props.details.account.aave.currentLiquidationThreshold)
		? ratio.lt(props.details.account.aave.ltv)
		? [ 'Safe',       '#24E5A3' ]
		: [ 'Warning',    '#FCB939' ]
		: [ 'Liquidable', '#FD5E75' ];

	return (
		<Grid container direction='row' justify='space-between' alignItems='stretch'>
			<Grid item xs>

				<Chart
					className = ''
					type      = "radialBar"
					height    = {200}
					options   = {{
						...options,
						colors: [ color ],
						labels: [ label ],
					}}
					series    = {[[ Number(ratio) ]]}
				/>

			</Grid>
			<Grid item xs container alignItems='center'>

				<MDBTable responsive borderless small>
					<MDBTableBody>
						{
							[
								{
									label: `Liquidation ratio`,
									value: `${Number(props.details.account.aave.currentLiquidationThreshold)}%`,
								},
								{
									label: `Borrow ratio`,
									value: `${Number(props.details.account.aave.ltv)}%`,
								},
								{
									label: `Current ratio`,
									value: `${Number(ratio)}%`,
								},
								{
									label: `Collateral (eq ${ethers.constants.EtherSymbol})`,
									value: `${Number(ethers.utils.formatEther(props.details.account.aave.totalCollateralETH)).toFixed(9)}`,
								},
								{
									label: `Borrowed (eq ${ethers.constants.EtherSymbol})`,
									value: `${Number(ethers.utils.formatEther(props.details.account.aave.totalBorrowsETH)).toFixed(9)}`,
								},
								{
									label: `Available (eq ${ethers.constants.EtherSymbol})`,
									value: `${Number(ethers.utils.formatEther(props.details.account.aave.availableBorrowsETH)).toFixed(9)}`,
								},
							]
							.map(({label, value}, i) => <tr key={i}><td className='py-1 font-weight-bold'>{label}</td><td className='p-1 text-right'>{value}</td></tr>)
						}
					</MDBTableBody>
				</MDBTable>

			</Grid>
		</Grid>

);

}

export default WalletAAVEHealthWrapper;
