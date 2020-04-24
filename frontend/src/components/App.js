import * as React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar    from './Navbar';
import Dashboard from './Dashboard';

const App = (props) =>
{
	return (
		<Router>
			<Navbar {...props}/>
			<Route exact path='/'><Redirect to='/index'/></Route>
			<Route exact path='/index' render={ (routing) => <Dashboard routing={routing} {...props}/> }/>
		</Router>
	);
}

export default App;
