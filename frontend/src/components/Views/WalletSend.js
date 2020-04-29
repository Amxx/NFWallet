import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputENS from '../UI/AddressInputENS';
import InputAdornment  from '@material-ui/core/InputAdornment';
import TextField       from '@material-ui/core/TextField';

import { ethers } from 'ethers';
import * as utils from '../../libs/utils'

import ERC20      from '../../abi/ERC20.json';


const WalletSend = (props) =>
{
	const [ base,   setBase   ] = React.useState(ethers.constants.EtherSymbol);
	const [ addr,   setAddr   ] = React.useState('');
	const [ value,  setValue  ] = React.useState('');
	const [ enough, setEnough ] = React.useState(true);

	React.useEffect(() => {
		try
		{
			setEnough(props.balances[base].balance >= value)
		} catch {}
	}, [props, base, value])

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		const asset  = props.balances[base];
		const amount = ethers.utils.bigNumberify(String(Number(value) * 10 ** asset.decimals));

		utils.executeTransactions(
			props.data.wallet.id,
			[[
				asset.isEth ? addr   : props.balances[base].address,
				asset.isEth ? amount : 0,
				asset.isEth ? '0x'   : (new ethers.utils.Interface(ERC20.abi)).functions['transfer'].encode([ addr, amount ]),
			]],
			props.services
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputENS
				color       = 'light'
				label       = 'destination'
				className   = 'my-1'
				onChange    = {setAddr}
				provider    = {props.services.provider}
			/>
			<TextField
				error       = {!enough}
				label       = 'amount'
				placeholder = '0.1'
				value       = {value}
				variant     = 'outlined'
				className   = 'my-1'
				onChange    = {e => setValue(e.target.value)}
				InputProps  = {{
					startAdornment:
						<InputAdornment position='start'>
							<select value={base} onChange={(e) => setBase(e.target.value)} style={{ 'width':'100px' }}>
								{
									Object.values(props.balances)
										.filter(({isEth, balance}) => isEth || balance > 0)
										.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
								}
							</select>
						</InputAdornment>,
					endAdornment:
						<InputAdornment position='end'>
							<MDBBtn color='light' className='z-depth-0' size='sm' onClick={() => setValue(props.balances[base].balance)}>max</MDBBtn>
						</InputAdornment>,
				}}
			/>
			<MDBBtn color='indigo' type='sumbit' className='mx-0' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Send { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletSend;
