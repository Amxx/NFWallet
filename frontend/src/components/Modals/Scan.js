import React from 'react';
import { MDBBtn       } from 'mdbreact';
import { MDBIcon      } from 'mdbreact';
import { MDBModal     } from 'mdbreact';
import { MDBModalBody } from 'mdbreact';
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
					<MDBIcon icon='qrcode' />
				</MDBBtn>
				<MDBModal isOpen={this.state.open} toggle={this.close.bind(this)} centered>
					<MDBModalBody>
						<video id='preview' style={{width: '100%'}}/>
					</MDBModalBody>
				</MDBModal>
			</>
		)
	}
}

export default Scan
