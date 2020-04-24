import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as utils from '../../utils';

const Entry = (props) =>
{
	const owner = props.accounts[0].toLowerCase() === props.entry.owner.id;
	const color = owner ? 'primary' : 'secondary'

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
				<a className={`content alert alert-${color}`} target='_blank' rel='nofollow noopener noreferrer' href={`https://rinkeby.etherscan.io/address/${props.entry.id}`}/>
			</OverlayTrigger>
		</div>
	);
}

export default Entry;
