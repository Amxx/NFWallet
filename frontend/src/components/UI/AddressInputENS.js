import * as React from 'react'
import * as EthereumReactComponents from 'ethereum-react-components';
import Cross      from './Cross';
import { ethers } from 'ethers';

function addressToIcon(address)
{
	if (address)
	{
		try
		{
			// try address is valid
			return <EthereumReactComponents.Identicon address={ ethers.utils.getAddress(address.toLowerCase()) } size="tiny" style={{ marginRight: '10px' }}/>
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
		return <EthereumReactComponents.Identicon anonymous size="tiny" style={{ marginRight: '10px' }}/>
	}
}

class AddressInputENS extends EthereumReactComponents.AddressInput
{
	componentDidMount = () =>
	{
		this.updateIcon(this.props.value || this.props.defaultValue || '')
	}

	updateIcon = async (value) => {
		let icon = null;
		try
		{
			icon = addressToIcon(await this.props.provider.resolveName(value) || value);
		}
		catch (_)
		{
			icon = addressToIcon(value);
		}
		finally
		{
			this.setState({ icon }, () => this.props.onChange && this.props.onChange(value));
		}
	}
}

export default AddressInputENS;
