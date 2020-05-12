import * as React from 'react';
import { MDBAlert } from 'mdbreact';


const Error = (props) =>
{
	return (
		<div className='m-auto container'>
			<MDBAlert color='danger' className='text-center font-weight-bold'>
				{ props.message }
			</MDBAlert>
		</div>
	);
}

export default Error;
