import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Error from './Error';


const Pagination = (props) => {

	const [pageSize,         ] = React.useState(Number(props.pageSize) || 20**2);
	const [page,     setPage ] = React.useState(Number(props.page)     || 0);
	let { data, loading, error } = useQuery(
		props.query,
		{
			variables:
			{
				...props.variables,
				first: pageSize,
				skip:  page * pageSize,
			},
			pollInterval: props.poolInterval || 2000
		}
	)

	if (loading) { data = { entries: [] } } // TODO: add a loading icon spinner
	if (error  ) { console.error(error); return <Error message='Error, see console for details'/>; }

	return (
		<>
			<div className={props.className}>
				{
					loading && props.loader
				}
				{
					props.component && data.entries.map((e, i) => <props.component key={i} index={i} entry={e} {...props}/>)
				}
				{
					props.placeholder && Array(pageSize - data.entries.length).fill().map((_, i) => <props.placeholder key={i+data.entries.length} index={i+data.entries.length} {...props}/>)
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
						{ data.entries.length && `${page*pageSize+1} - ${page*pageSize+data.entries.length}` }
					</a>
				</li>
				<li className={ `page-item ${data.entries.length === pageSize?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setPage(page+1) }>›</a>
				</li>
				<li className={`page-item ${props.maxPage?'':'disabled'}`}>
				{
					props.maxPage
					? <a className='page-link' href='#!' onClick={ () => setPage(props.maxPage) }>»</a>
					: <a className='page-link' href='#!'>&#8239;</a>
				}
				</li>
			</ul>
		</>
	);
}

export default Pagination;
