import * as React from 'react';
import TextField       from '@material-ui/core/TextField';
import InputAdornment  from '@material-ui/core/InputAdornment';
import Switch          from '@material-ui/core/Switch';

import { ethers } from 'ethers';


// props: {
// 	label
// 	placeholder
// 	variant
// 	className
// 	token
// 	tokenSelector
// 	tokenDecimals
// 	tokenBalance
// 	callbacks
// }
const BalanceInput = (props) =>
{
	const [ token,   setToken   ] = React.useState(null);
	const [ value,   setValue   ] = React.useState(ethers.constants.Zero);
	const [ view,    setView    ] = React.useState('');
	const [ max,     setMax     ] = React.useState(false);
	const [ enough,  setEnough  ] = React.useState(true);

	const handleChange = (e) =>
	{
		updateView(e.target.value);
		setMax(false);
	}

	const updateView = (v) =>
	{
		if (v === '' || isNaN(v))
		{
			setValue(ethers.constants.Zero);
			setView(v);
		}
		else
		{
			try
			{
				setValue(ethers.utils.parseUnits(v, props.tokenDecimals || 18));
				setView(v);
			} catch {}
		}
	}

	const updateValue = (v) =>
	{
		try
		{
			setView(ethers.utils.formatUnits(v, props.tokenDecimals || 18));
			setValue(v);
		} catch {}
	}

	// asserving
	React.useEffect(() => {
		props.tokenSymbol && setToken(props.tokenSymbol)
	}, [props.tokenSymbol]);

	React.useEffect(() => {
		props.value && updateValue(props.value)
	}, [props.value]);

	// write maxbalance
	React.useEffect(() => {
		max && updateValue(props.tokenBalance);
	}, [props.tokenBalance, max]);

	// check balance
	React.useEffect(() => {
		setEnough(!props.tokenBalance || max || value.lte(props.tokenBalance));
	}, [props.tokenBalance, max, value]);

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
		props.callbacks.setAmount({value, max});
	}, [token, value, max]);

	return (
		<TextField
			disabled    = { props.disabled                  }
			error       = { !enough                         }
			label       = { props.label                     }
			placeholder = { props.placeholder || '0.1'      }
			value       = { view                            }
			variant     = { props.variant     || 'outlined' }
			className   = { props.className                 }
			onChange    = { handleChange                    }
			InputProps  = {{
					startAdornment:
						(props.tokenSelector || token) &&
						<InputAdornment position='start'>
							{
								props.tokenSelector
								?
									<select value={token} onChange={(e) => setToken(e.target.value)} style={{ 'width':'100px' }}>
										{ props.tokenSelector.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>) }
									</select>
								:
									token
							}
						</InputAdornment>,
					endAdornment:
						props.tokenBalance &&
						<InputAdornment position='end'>
							<Switch color='primary' checked={max} onChange={(ev) => setMax(ev.target.checked)}/><span className='text-muted'>max</span>
						</InputAdornment>,
			}}
		/>
	);
}

export default BalanceInput;
