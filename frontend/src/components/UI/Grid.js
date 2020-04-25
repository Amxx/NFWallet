import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';

import '../../css/UI/Grid.css';

const DEFAULT = {
	pageSize:     20**2,
	poolInterval: 10000,
}

const PlaceHolder = () => {
	return (
		<div className='block'>
			<div className='content'/>
		</div>
	);
}

const Grid = (props) => {

	const settings = { ...DEFAULT, ...props };

	const [page, setPage] = React.useState(parseInt(settings.page) || 0);

	let { data, loading, error } = useQuery(
		settings.query,
		{
			variables:
			{
				...settings.variables,
				first: settings.pageSize,
				skip:  page * settings.pageSize,
			},
			pollInterval: settings.poolInterval
		}
	)

	if (loading) { data = { entries: [] } } // TODO: add a loading icon spinner
	if (error  ) { return `Error! ${error}`; }

	return (
		<>
			<div className='grid'>
				{
					loading &&
					<div className='spinner-overlay'>
						<Spinner animation='grow'>
							<span className='sr-only'>Loading...</span>
						</Spinner>
					</div>
				}
				{
					data.entries.map((e, i) => <settings.component key={i} index={i} entry={e} {...props}/>)
				}
				{
					Array(settings.pageSize - data.entries.length).fill().map((_, i) => <PlaceHolder key={i+data.entries.length}/>)
				}
			</div>
			<ul className='pagination'>
				<li className={ `page-item ${page>0?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setPage(0) }>«</a>
				</li>
				<li className={ `page-item ${page>0?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setPage(page-1) }>‹</a>
				</li>
				<li className='page-item disabled'>
					<a className='page-link' href='#!'>
						{ data.entries.length && `${page*settings.pageSize+1} - ${page*settings.pageSize+data.entries.length}` }
					</a>
				</li>
				<li className={ `page-item ${data.entries.length === settings.pageSize?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setPage(page+1) }>›</a>
				</li>
				<li className='page-item disabled'>
					<a className='page-link' href='#!'>&#8239;</a>
				</li>
			</ul>
		</>
	);
}

export default Grid;
