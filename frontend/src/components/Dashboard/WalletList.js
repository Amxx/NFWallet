import * as React from 'react';
import { Link } from 'react-router-dom';
import * as EthereumReactComponents from 'ethereum-react-components';
import { useQuery } from '@apollo/react-hooks';
import graphql from '../../graphql';

const DEFAULT = {
	pageSize:     5,
	poolInterval: 2000,
}

const WalletList = (props) =>
{
	const settings = { ...DEFAULT, ...props };
	const [page, setPage] = React.useState(parseInt(settings.page) || 0);

	let { data, loading, error } = useQuery(
		graphql.wallets,
		{
			variables:
			{
				account: props.owner.toLowerCase(),
				first:   settings.pageSize,
				skip:    page * settings.pageSize,
			},
			pollInterval: settings.poolInterval
		}
	)

	if (loading) { data = { entries: [] } } // TODO: add a loading icon spinner
	if (error  ) { return `Error! ${error}`; }

	return (
		<>
			<div className='d-flex flex-wrap'>
				{
					data.entries.map((wallet, i) =>
						<Link key={i} to={`/dashboard/${wallet.id}`}>
							<EthereumReactComponents.AccountItem
								name    = 'NFWallet'
								address = {wallet.id}
								balance = {0}
							/>
						</Link>
					)
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

export default WalletList;
