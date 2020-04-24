import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as utils from '../utils';

const Token = (props) =>
{
	const mine  = props.accounts[0].toLowerCase() === props.entry.owner.id;
	const color = mine ? 'primary' : 'secondary'

	return (
		<div className='block'>
			<OverlayTrigger
				placement='top'
				overlay={
					<Tooltip>
						{ utils.toShortAddress(props.entry.id) }
					</Tooltip>
				}
			>
				<a className={`content alert alert-${color}`} target='_blank' rel='nofollow noopener noreferrer' href={`https://etherscan.io/address/${props.entry.id}`}/>
			</OverlayTrigger>
		</div>
	);
}

export default Token;
