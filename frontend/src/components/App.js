import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar    from './Navbar';
import Dashboard from './Dashboard/Dashboard';

const App = (props) =>
{
	return (
		<Router>
			<Navbar {...props}/>
			<Route exact path='/' render={ (routing) => <Dashboard routing={routing} {...props}/> }/>
		</Router>
	);
}

export default App;
