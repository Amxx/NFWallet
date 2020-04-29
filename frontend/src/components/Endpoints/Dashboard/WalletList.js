import * as React from 'react';
import { Spinner }    from 'react-bootstrap';
import graphql    from '../../../graphql';

import Pagination     from '../../UI/Pagination';
import WalletListItem from './WalletListItem';


const WalletList = (props) =>
	<Pagination
		query       = {graphql.wallets}
		variables   = {{account: props.owner.toLowerCase()}}
		className   = {`d-flex flex-wrap ${props.center ? 'justify-content-center': ''}`}
		pageSize    = {5}
		loader      = {<div className='spinner-overlay'><Spinner animation='grow'><span className='sr-only'>Loading...</span></Spinner></div>}
		component   = {WalletListItem}
		{...props}
	/>

export default WalletList;
