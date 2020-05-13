import * as React from 'react'
import * as EthereumReactComponents from 'ethereum-react-components';
import TextField      from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Cross          from './Cross';
import { ethers }     from 'ethers';

import Scan from '../Modals/Scan';


function addressToIcon(address)
{
	if (address)
	{
		try
		{
			// try address is valid
			return <EthereumReactComponents.Identicon address={ ethers.utils.getAddress(address.toLowerCase()) } size='tiny' style={{ marginRight: '10px' }}/>
		}
		catch (_)
		{
			// catch invalid address
			return <Cross size={23} style={{ marginRight: '8px', marginLeft: '0px' }}/>;
		}
	}
	else
	{
		// not address was provided
		return <EthereumReactComponents.Identicon anonymous size='tiny' style={{ marginRight: '10px' }}/>
	}
}

class AddressInputETH extends EthereumReactComponents.AddressInput
{
	constructor(props)
	{
		super(props);
		this.state = {
			icon: '',
			addr: this.props.value || this.props.defaultValue || '',
		}
	}

	componentDidMount()
	{
		this.updateIcon(this.state.addr)
	}

	componentWillReceiveProps(newprops)
	{
		if (newprops.value || newprops.defaultValue)
		{
			this.setAddr(newprops.value || newprops.defaultValue)
		}
	}

	async updateIconENS(value)
	{
		try
		{
			this.setState({ icon: addressToIcon(await this.props.provider.resolveName(value) || value) });
		}
		catch
		{
			this.setState({ icon: addressToIcon(value) });
		}
	}

	setAddr(addr)
	{
		this.setState({ addr });
		this.updateIconENS(addr);
		this.props.onChange && this.props.onChange(addr);
	}

	callback(value)
	{
		try
		{
			this.setAddr(ethers.utils.getAddress((/0x[0-9a-fA-F]{40}/).exec(value)[0]))
		}
		catch
		{
			this.setAddr(value)
		}
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
				placeholder = '0x000000...'
				InputProps  = {{
					startAdornment: <InputAdornment>{this.state.icon}</InputAdornment>,
					endAdornment:   <InputAdornment><Scan color={this.props.color || 'blue'} className='z-depth-0' size='sm' callback={this.callback.bind(this)}/></InputAdornment>,
				}}
			/>
		)
	}
}

export default AddressInputETH;
