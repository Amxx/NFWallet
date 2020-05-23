import * as React from 'react'
import * as EthereumReactComponents from 'ethereum-react-components';
import { ethers } from 'ethers';


const ETHAddress = (props) =>
{
	const [ resolved, setResolved ] = React.useState(null);

	React.useEffect(() => {
		(async () => {
			try
			{
				setResolved(await props.provider.lookupAddress(props.address))
			}
			catch
			{
				try
				{
					setResolved(ethers.utils.getAddress(props.address))
				}
				catch {}
			}
		})();
	}, [props.address, props.provider]);

	return (
		<EthereumReactComponents.EthAddress
			address = { resolved ? resolved : props.address }
			short   = { props.short   }
			onClick = { props.onClick }
			classes = { props.classes }
		/>
	)
}

export default ETHAddress;
