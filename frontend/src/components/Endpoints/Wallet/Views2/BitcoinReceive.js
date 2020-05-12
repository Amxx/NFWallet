import * as React from 'react';
import QRCode from 'qrcode.react';
import { pBTC } from 'ptokens-pbtc';
import { MDBAlert } from 'mdbreact';
import { Spinner  } from 'react-bootstrap';

import { ethers }      from 'ethers';
import * as utils      from '../../../../libs/utils'
import ERC1820Registry from '../../../../abi/ERC1820Registry.json';


const PTokenReceive = (props) =>
{
	const [ ERC777TokenRecipientID ] = React.useState("0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b");
	const [ registry               ] = React.useState(new ethers.Contract(ERC1820Registry.networks[props.services.network.chainId].address, ERC1820Registry.abi, props.services.provider));
	const [ deposit, setDeposit    ] = React.useState(null);
	const [ ready, setReady        ] = React.useState(false);

	React.useState(() => {
		registry.getInterfaceImplementer(props.details.account.address, ERC777TokenRecipientID).then(implemented => setReady(implemented.toLowerCase() === props.details.account.address.toLowerCase()));
	}, [props])

	const handleRegister = () =>
	{
		utils.executeTransactions(
			props.details.account.address,
			[
				{
					address:  registry.address,
					artefact: ERC1820Registry,
					method:   'setInterfaceImplementer',
					args:     [ props.details.account.address, ERC777TokenRecipientID, props.details.account.address ],
				},
			],
			props.services
		);
	}

	React.useState(() => {
		(new pBTC({
			ethProvider: props.services.provider.provider,
			btcNetwork:  props.services.network.chainId === 1 ? 'bitcoin' : 'testnet'
		})).getDepositAddress(props.details.account.address.toLowerCase()).then(({value}) => setDeposit(value));
	}, [props])

	return (
		ready
		? deposit
		?
			<div className='text-center'>
				<div className='font-weight-bold'>Deposit bitcoin using <a href='https://ptokens.io/' target='_blank' rel='nofollow noopener noreferrer'>pToken</a></div>
				<div><QRCode value={deposit} size={256} includeMargin/></div>
				<div className='text-muted'>{deposit}</div>
			</div>
		:
			<div className='text-center'>
				<Spinner animation='grow'>
					<span className='sr-only'>Loading...</span>
				</Spinner>
			</div>
		:
			<MDBAlert color='danger' className='text-center font-weight-bold'>
				This wallet is not setup to receive ERC777 tokens. <a href='#!' onClick={handleRegister}>Click here to enable ERC777 reception</a>
			</MDBAlert>

	);
}

export default PTokenReceive;
