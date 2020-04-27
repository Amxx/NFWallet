import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputENS from '../UI/AddressInputENS';
import InputAdornment  from '@material-ui/core/InputAdornment';
import TextField       from '@material-ui/core/TextField';

import { ethers } from 'ethers';
import { abi as ABIERC20  } from '../../abi/ERC20.json';
import { abi as ABIWallet } from '../../abi/NFWallet.json';


const WalletTX = (props) =>
{
	const wallet = new ethers.Contract(props.data.wallet.id, ABIWallet, props.services.provider.getSigner());

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
		const isEth  = asset.symbol === ethers.constants.EtherSymbol;

		wallet.forward(
			isEth ? addr   : props.balances[base].address,
			isEth ? amount : 0,
			isEth ? '0x'   : (new ethers.utils.Interface(ABIERC20)).functions['transfer'].encode([ addr, amount ]),
		)
		.then(txPromise => {
			props.services.emitter.emit('Notify', 'info', 'Transaction sent');
			txPromise.wait()
			.then(() => {
				props.services.emitter.emit('Notify', 'success', 'Transaction successfull');
				props.services.emitter.emit('tx');
			}) // success
			.catch(() => {
				props.services.emitter.emit('Notify', 'error', 'Transaction failled');
			}) // transaction error
		})
		.catch(() => {
			props.services.emitter.emit('Notify', 'error', 'Signature required');
		}) // signature error
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputENS
				className='my-1'
				label='destination'
				defaultValue={addr}
				onChange={setAddr}
				provider={props.services.provider}
			/>
			<TextField
				error={!enough}
				className='my-1'
				label='amount'
				placeholder='0.1'
				value={value}
				onChange={e => setValue(e.target.value)}
				InputProps={{
					startAdornment:
						<InputAdornment position='start'>
							<select value={base} onChange={(e) => setBase(e.target.value)} style={{ 'width':'100px' }}>
								{
									Object.values(props.balances)
										.filter(({balance}) => balance > 0)
										.map(({ symbol }, i) => <option key={i} value={symbol}>{symbol}</option>)
								}
							</select>
						</InputAdornment>,
					endAdornment:
						<InputAdornment position='end'>
							<MDBBtn color='blue' className='z-depth-0' size='sm' onClick={() => setValue(props.balances[base].balance)}>max</MDBBtn>
						</InputAdornment>,
				}}
				variant='outlined'
			/>
			<MDBBtn color='blue' type='sumbit' className='mx-0' size='sm' disabled={!enough || (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Send { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletTX;
