import React from 'react';
import { Identicon } from 'ethereum-react-components';
import {
	// MDBIcon,
	MDBNavbar,
	MDBNavbarBrand,
	MDBNavbarNav,
	MDBNavItem,
	// MDBNavLink,
	MDBNavbarToggler,
	MDBCollapse,
	// MDBDropdown,
	// MDBDropdownToggle,
	// MDBDropdownMenu,
	// MDBDropdownItem,
} from 'mdbreact';

// import './Navbar.css';

const Navbar = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const toggleCollapse = () => setOpen(!open);

	return (
		<MDBNavbar color='black' dark expand='md'>
			<MDBNavbarBrand>
				<strong className='white-text'>
					NonFungibleWallets
				</strong>
			</MDBNavbarBrand>
			<MDBNavbarToggler onClick={toggleCollapse} />
			<MDBCollapse id='navbarCollapse' isOpen={open} navbar>
				<MDBNavbarNav left>


				</MDBNavbarNav>
				<MDBNavbarNav right>

					<MDBNavItem>
						<a target='_blank' rel='nofollow noopener noreferrer' href={`https://etherscan.io/address/${props.accounts[0]}`}>
							<Identicon address={props.accounts[0]} size='small' />
						</a>
					</MDBNavItem>

				</MDBNavbarNav>
			</MDBCollapse>
		</MDBNavbar>
	);
}

export default Navbar;
