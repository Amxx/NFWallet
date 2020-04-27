import * as React from 'react';
import { MDBCard, MDBCardTitle, MDBCardBody } from 'mdbreact';

const CardWrapper = (props) =>
	<div className={props.className}>
		<MDBCard>
			<MDBCardBody className={props.center && 'd-flex justify-content-center align-items-center'}>
				{ props.title && <MDBCardTitle>{ props.title }</MDBCardTitle> }
				{ props.title && <hr className='hr-grey'/> }
				{ props.children }
			</MDBCardBody>
		</MDBCard>
	</div>

export default CardWrapper;
