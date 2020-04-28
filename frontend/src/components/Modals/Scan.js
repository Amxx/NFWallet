import React from 'react';
import {
	MDBBtn,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
} from 'mdbreact';
import Instascan from '@eventstag/instascan'



class Scan extends React.Component
{
	state = {
		open:    false,
		scanner: null,
	}

	open()
	{
		Instascan.Camera.getCameras()
		.then(cameras => {
			this.setState({ open: true })
			let scanner = new Instascan.Scanner({ video: document.getElementById('preview') })
			scanner.addListener('scan', this.process.bind(this))
			scanner.start(cameras[0])
				.then(() => this.setState({ scanner }))
				.catch(console.error)
		})
		.catch(console.error)
	}

	close()
	{
		if (this.state.scanner) { this.state.scanner.stop(); }
		this.setState({ open: false })
	}

	process(value)
	{
		if (this.props.callback) { this.props.callback(value); }
		this.close();
	}

	render()
	{
		return (
			<>
				<MDBBtn
					color     = {this.props.color}
					size      = {this.props.size}
					className = {this.props.className}
					onClick   = {this.open.bind(this)}
				>
					<i className="fas fa-qrcode"></i>
				</MDBBtn>
				<MDBModal isOpen={this.state.open} toggle={this.close.bind(this)} centered>
					<MDBModalHeader toggle={this.close.bind(this)}>Scan address</MDBModalHeader>
					<MDBModalBody>
						<video id='preview' style={{width: '100%'}}/>
					</MDBModalBody>
				</MDBModal>
			</>
		)
	}
}

export default Scan


























//
// const PredictWallet = (props) =>
// {
// 	const [ open, setOpen ] = React.useState(false);
// 	const [ addr, setAddr ] = React.useState(props.services.accounts[0]);
// 	const [ seed, setSeed ] = React.useState('');
// 	const [ pred, setPred ] = React.useState('');
// 	const toggle = () => setOpen(!open);
//
// 	React.useEffect(() => {
// 		try
// 		{
// 			props.services.registry.predictWallet(addr.toLowerCase(), ethers.utils.id(seed)).then(setPred).catch(() => {})
// 		}
// 		catch (_)
// 		{
// 			setPred('')
// 		}
// 	}, [addr, seed, props.services]);
//
// 	return (
// 		<>
// 			<MDBNavLink to='#!' onClick={toggle}>
// 				Hidden wallet
// 			</MDBNavLink>
// 			<MDBModal isOpen={open} toggle={toggle} centered>
// 				<MDBModalHeader toggle={toggle}>Predict hidden wallet</MDBModalHeader>
// 				<MDBModalBody>
// 					<div className='d-flex flex-column justify-content-center'>
// 						<AddressInputENS className='my-1' label='initial owner' defaultValue={addr} onChange={setAddr} provider={props.services.provider}/>
// 						<TextField       className='my-1' label='seed'          defaultValue={seed} onChange={e => setSeed(e.target.value)} variant='outlined'/>
// 						<MDBIcon         className='my-3 text-center' icon='arrow-down'/>
// 						<AccountItem     className='my-1' name='hidden wallet address' address={pred}/>
// 					</div>
// 				</MDBModalBody>
// 				<MDBModalFooter className='justify-content-center text-justify text-muted'>
// 					<small>
// 						This modal will help you predict the address of a NFWallet.
// 						Given the address of the initial owner and a seed, you can get the address of a wallet that you can use straight away.
// 						This hidden wallet won't show up uptill you instanciate it.
// 						When you finally want to withdraw assets from an hidden wallet, instanciate it using the advanced options in the “New Wallet” modal.
// 					</small>
// 					<small>
// 						<strong>Be carefull not to lose your seed!</strong>
// 					</small>
// 				</MDBModalFooter>
// 			</MDBModal>
// 		</>
// 	);
// }
//
// export default PredictWallet;
