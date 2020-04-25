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
	const [first, setFirst] = React.useState(parseInt(settings.first) || 0);

	let { data, loading, error } = useQuery(
		graphql.wallets,
		{
			variables:
			{
				account: props.owner.toLowerCase(),
				first:   settings.pageSize,
				skip:    first,
			},
			pollInterval: settings.poolInterval
		}
	)

	if (loading) { data = { entries: [] } } // TODO: add a loading icon spinner
	if (error  ) { return `Error! ${error}`; }

	return (
		<>
			<div className={`d-flex flex-wrap ${props.center ? 'justify-content-center': ''}`}>
				{
					loading && <p className='text-muted'>Loading...</p>
				}
				{
					!loading && !data.entries.length && <p className='text-muted'>You do not own any nfwallets.</p>
				}
				{
					data.entries.map((wallet, i) =>
						<Link key={i} to={`/wallet/${wallet.id}`}>
							<EthereumReactComponents.AccountItem
								name    = 'NFWallet'
								address = {wallet.id}
								balance = {wallet.balance}
							/>
						</Link>
					)
				}
			</div>
			<ul className='pagination'>
				<li className={ `page-item ${first>0?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setFirst(0) }>«</a>
				</li>
				<li className={ `page-item ${first>0?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setFirst(first-settings.pageSize) }>‹</a>
				</li>
				<li className='page-item disabled'>
					<a className='page-link' href='#!'>
						{ data.entries.length && `${first+1} - ${first+data.entries.length}` }
					</a>
				</li>
				<li className={ `page-item ${data.entries.length === settings.pageSize?'':'disabled'}` }>
					<a className='page-link' href='#!' onClick={ () => setFirst(first+settings.pageSize) }>›</a>
				</li>
				<li className='page-item disabled'>
					<a className='page-link' href='#!'>&#8239;</a>
				</li>
			</ul>
		</>
	);
}

export default WalletList;
