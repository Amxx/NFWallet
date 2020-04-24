import React from 'react';
import { Identicon } from 'ethereum-react-components';
import {
	MDBNavbar,
	MDBNavbarBrand,
	MDBNavbarNav,
	MDBNavItem,
	MDBNavbarToggler,
	MDBCollapse,
} from 'mdbreact';

import MintWallet   from './Modals/MintWallet';
import HiddenWallet from './Modals/HiddenWallet';


const Navbar = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const toggle = () => setOpen(!open);

	return (
		<MDBNavbar color='blue-gradient' dark expand='md'>
			<MDBNavbarBrand>
				<strong className='white-text'>
					NFWExplorer
				</strong>
			</MDBNavbarBrand>
			<MDBNavbarToggler onClick={toggle} />
			<MDBCollapse id='navbarCollapse' isOpen={open} navbar>
				<MDBNavbarNav left>

				</MDBNavbarNav>
				<MDBNavbarNav right>

					<MDBNavItem>
						<MintWallet {...props}/>
					</MDBNavItem>
					<MDBNavItem>
						<HiddenWallet {...props}/>
					</MDBNavItem>

				</MDBNavbarNav>
			</MDBCollapse>
		</MDBNavbar>
	);
}

export default Navbar;
