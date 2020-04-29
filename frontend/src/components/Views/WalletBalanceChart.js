import * as React from 'react';
import Chart from 'react-apexcharts';
import {ethers} from 'ethers';

const WalletBalanceChart = (props) =>
{
	// format
	const balanceIn  = props.data.balanceIn.map (({ timestamp, value }) => ([ Number(timestamp)*1000, ethers.utils.bigNumberify(value).mul(+1) ]))
	const balanceOut = props.data.balanceOut.map(({ timestamp, value }) => ([ Number(timestamp)*1000, ethers.utils.bigNumberify(value).mul(-1) ]))

	// earliest full record
	let start  = Number(props.data.creation[0].timestamp) * 1000;
	if ( balanceIn.length === 1000) { start = Math.max(start,  balanceIn[balanceIn.length  - 1][0]); }
	if (balanceOut.length === 1000) { start = Math.max(start, balanceOut[balanceOut.length - 1][0]); }

	// history of balances
	let history = [[ (new Date()).getTime(), ethers.utils.bigNumberify(props.data.wallet.balance) ]];
	// process all balance events
	[ ...balanceIn, ...balanceOut ]
	.filter(([ timestamp ]) => timestamp >= start)
	.sort(([ timestamp1 ], [ timestamp2 ]) => timestamp1 < timestamp2)
	.forEach(([ timestamp, value ]) => history.push([ timestamp, history[history.length-1][1].sub(value) ]));

	// adding creation/start
	history.push([ start, history[history.length-1][1] ]);

	return (
		<Chart
			type    = 'area'
			series  = {[ { name: 'Balance', data: history.map(([timestamp, value]) => ([timestamp, value / 10 ** 18]))  } ]}
			options = {{
				stroke:     { curve:   'stepline'     },
				fill:       { type:    'gradient'     },
				xaxis:      { type:    'datetime'     },
				yaxis:      { show:    false          },
				grid:       { show:    false          },
				tooltip:    { enabled: true           },
				chart:      { toolbar: { show: true } },
				dataLabels: { enabled: true, formatter: (val) => `${ethers.constants.EtherSymbol}${parseFloat(val).toFixed(2)}` },
			}}
			{...props.extra}
		/>
	);
}

export default WalletBalanceChart;
