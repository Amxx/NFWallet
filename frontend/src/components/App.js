import * as React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar    from './Navbar';
import Dashboard from './Dashboard/Dashboard';
import Overview  from './Overview/Overview';

const App = (props) =>
{
	return (
		<Router>
			<Navbar {...props}/>
			<Route exact path='/'><Redirect to='/dashboard'/></Route>
			<Route path='/dashboard/:wallet?' render={ (routing) => <Dashboard routing={routing} {...props}/> }/>
			<Route path='/overview'           render={ (routing) => <Overview  routing={routing} {...props}/> }/>
		</Router>
	);
}

export default App;
