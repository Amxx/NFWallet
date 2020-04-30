import * as React from 'react';
import TextField       from '@material-ui/core/TextField';
import InputAdornment  from '@material-ui/core/InputAdornment';
import Switch          from '@material-ui/core/Switch';

// props: {
// 	balances   (required)
// 	token      (optional) → default use ETH
// 	filter     (optional) → default no selector
// 	label      (optional) → default amount
// 	switchAAVE (optional) → switch token - aToken
// }
const BalanceInput = (props) =>
{
	const [ value,   setValue   ] = React.useState('');
	const [ balance, setBalance ] = React.useState('');
	const [ max,     setMax     ] = React.useState(false);
	const [ token,   setToken   ] = React.useState(props.token || 'ETH');
	const [ enough,  setEnough  ] = React.useState(true);

	const handleChange = (e) =>
	{
		setValue(e.target.value);
		setMax(false);
	}

	const toogleMax = (e) => {
		setMax(e.target.checked);
	}

	// listen to token prop
	React.useEffect(() => {
		if (props.token)
		{
			setToken(props.token)
		}
	}, [props.token])

	// keep track of balance for current token
	React.useEffect(() => {
		setBalance(props.switchAAVE ? props.balances[token].reserveData.aTokenBalance : props.balances[token].balance)
	}, [props.balances, props.switchAAVE, token])

	// write maxbalance
	React.useEffect(() => {
		max && setValue(balance)
	}, [max, balance])

	// check balance
	React.useEffect(() => {
		setEnough(props.unlimited || max || value <= balance);
	}, [max, balance, value])

	// callbacks
	React.useEffect(() => {
		props.callbacks &&
		props.callbacks.setEnough &&
		props.callbacks.setEnough(enough);
	}, [enough]);

	React.useEffect(() => {
		props.callbacks &&
		props.callbacks.setToken &&
		props.callbacks.setToken(token);
	}, [token]);

	React.useEffect(() => {
		props.callbacks &&
		props.callbacks.setAmount &&
		props.callbacks.setAmount({ value: String(value * 10 ** props.balances[token].decimals), max });
	}, [token, value, max]);

	return (
		<TextField
			error       = { !enough                         }
			label       = { props.label       || 'amount'   }
			placeholder = { props.placeholder || '0.1'      }
			value       = { value                           }
			variant     = { props.variant     || 'outlined' }
			className   = { 'my-1 ' + props.className       }
			onChange    = { handleChange                    }
			InputProps  = {{
					startAdornment:
						<InputAdornment position='start'>
							{
								props.filter
								?
									<select value={token} onChange={(e) => setToken(e.target.value)} style={{ 'width':'100px' }}>
										{ Object.values(props.balances).filter(props.filter).map(({ symbol }, i) => <option key={i} value={symbol}>{props.switchAAVE&&'a'}{symbol}</option>) }
									</select>
								:
									token
							}
						</InputAdornment>,
					endAdornment:
						!props.unlimited &&
						<InputAdornment position='end'>
							<Switch color='primary' checked={max} onChange={toogleMax}/><span className='text-muted'>max</span>
						</InputAdornment>,
			}}
		/>
	);
}

export default BalanceInput;
