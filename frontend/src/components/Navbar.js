import React from 'react';
import {
	MDBNavbar,
	MDBNavbarBrand,
	MDBNavbarNav,
	MDBNavItem,
	MDBNavLink,
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

					<MDBNavItem>
						<MDBNavLink link to='/dashboard'>Dashboard</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
						<MDBNavLink link to='/overview'>Univers</MDBNavLink>
					</MDBNavItem>

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
