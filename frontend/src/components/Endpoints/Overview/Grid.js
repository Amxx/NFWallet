import React from 'react';
import { Spinner } from 'react-bootstrap';
import Pagination from '../../UI/Pagination';
import './Grid.css';


const Grid = (props) =>
	<Pagination
		className   = 'grid'
		pageSize    = { 20 ** 2 }
		loader      = { <div className='spinner-overlay'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div> }
		placeholder = { () => <div className='block'><div className='content'/></div> }
		{...props}
	/>

export default Grid;
