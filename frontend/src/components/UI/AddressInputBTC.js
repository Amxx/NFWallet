import * as React from 'react'
import * as EthereumReactComponents from 'ethereum-react-components';
import TextField      from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import Scan from '../Modals/Scan';


class AddressInputBTC extends EthereumReactComponents.AddressInput
{
	constructor(props)
	{
		super(props);
		this.state = {
			icon: '',
			addr: this.props.value || this.props.defaultValue || '',
		}
	}

	setAddr(addr)
	{
		this.setState({ addr });
		this.props.onChange && this.props.onChange(addr);
	}

	callback(value)
	{
		const parsed = (/[0-9a-zA-Z]{42}/).exec(value)
		this.setAddr(parsed ? parsed[0] : value);
	}

	render()
	{
		return (
			<TextField
				label       = {this.props.label}
				value       = {this.state.addr}
				variant     = 'outlined'
				className   = {this.props.className}
				onChange    = {e => this.setAddr(e.target.value)}
				InputProps  = {{
					endAdornment: <InputAdornment><Scan color={this.props.color || 'blue'} className='z-depth-0' size='sm' callback={this.callback.bind(this)}/></InputAdornment>,
				}}
			/>
		)
	}
}

export default AddressInputBTC;
