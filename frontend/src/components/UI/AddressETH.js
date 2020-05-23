import * as React from 'react'
import { ethers }     from 'ethers';


const AddressETH = (props) =>
{
	const [ resolved, setResolved ] = React.useState(null);

	React.useEffect(() => {
		props.services.provider.lookupAddress(props.addr)
		.then(setResolved)
		.catch(() => setResolved(null));
	}, [props]);

	return (
		<a className={props.className} href={`${props.services.config.etherscan}/address/${props.addr}`} target='_blank' rel='nofollow noopener noreferrer'>
			{ resolved ? resolved : ethers.utils.getAddress(props.addr) }
		</a>
	)
}

export default AddressETH;
