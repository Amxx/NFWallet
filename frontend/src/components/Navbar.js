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
import MintWallet    from './Modals/MintWallet';
import PredictWallet from './Modals/PredictWallet';

import icon from '../assets/nfw-logo-03.svg'

const Navbar = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const toggle = () => setOpen(!open);

	return (
		<MDBNavbar color='blue-gradient' dark expand='md' className='sticky-top z-depth-2'>
			<MDBNavbarBrand className='d-flex align-items-center'>
				<img src={icon} alt='nfw-logo' height={32}/>
				<strong className='white-text ml-2'>
					NFWExplorer ({props.services.network.name})
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
						<MintWallet services={props.services}/>
					</MDBNavItem>
					<MDBNavItem>
						<PredictWallet services={props.services}/>
					</MDBNavItem>

				</MDBNavbarNav>
			</MDBCollapse>
		</MDBNavbar>
	);
}

export default Navbar;
