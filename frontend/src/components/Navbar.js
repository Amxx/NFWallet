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
import Switch        from '@material-ui/core/Switch';
import MintWallet    from './Modals/MintWallet';
import PredictWallet from './Modals/PredictWallet';

import icon from '../assets/nfw-logo-03.svg'

const Navbar = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const toggle    = () => setOpen(!open);
	const toggleGSN = () => props.services.gsnProvider ? props.services.setUseGSN(!props.services.useGSN) : props.services.emitter.emit('Notify', 'warning', 'GSN not available on this network')

	return (
		<MDBNavbar color='darktheme' dark expand='md' className='sticky-top z-depth-2'>
			<MDBNavbarBrand className='d-flex align-items-center'>
				<img src={icon} alt='nfw-logo' height={32}/>
				<strong className='white-text ml-2'>
					NFWExplorer
				</strong>
				&nbsp;
				<small className='text-capitalize'>
					({props.services.network.name})
				</small>
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

					<MDBNavItem className='d-flex align-items-center text-white ml-3'>
						<span>GSN</span>
						<Switch
							size='small'
							color='primary'
							checked={props.services.useGSN}
							onChange={toggleGSN}
						/>
					</MDBNavItem>

				</MDBNavbarNav>
			</MDBCollapse>
		</MDBNavbar>
	);
}

export default Navbar;
