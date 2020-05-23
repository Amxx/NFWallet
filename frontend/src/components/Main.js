import * as React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar    from './Navbar';
import Dashboard from './Endpoints/Dashboard';
import Overview  from './Endpoints/Overview';
import Wallet    from './Endpoints/Wallet';


const Main = (props) =>
{
	return (
		<Router>
			<Navbar {...props}/>
			<Route exact path='/'><Redirect to='/dashboard'/></Route>
			<Route path='/dashboard'       render={ (routing) => <Dashboard routing={routing} {...props}/> }/>
			<Route path='/overview'        render={ (routing) => <Overview  routing={routing} {...props}/> }/>
			<Route path='/wallet/:wallet?' render={ (routing) => <Wallet    routing={routing} {...props}/> }/>
		</Router>
	);
}

export default Main;
