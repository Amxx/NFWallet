import * as React from 'react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey           } from '@fortawesome/free-solid-svg-icons';
import { Identicon       } from 'ethereum-react-components';
import ETHAddress          from './ETHAddress';


const AccountItem = (props) =>
	<StyledWrapper>

		<FlexWrapper>
			<Identicon address={props.address} size='small' />
		</FlexWrapper>

		<FlexWrapper>
			<StyledName>
				<FontAwesomeIcon icon={faKey} style={{ width: '0.8em' }} /> {props.name}
			</StyledName>

			{
				props.balance &&
				<StyledBalance>
					{props.balance} <StyledBalanceEther>ether</StyledBalanceEther>
				</StyledBalance>
			}

			<StyledAddress>
				<ETHAddress address={props.address} short={props.short}/>
			</StyledAddress>
		</FlexWrapper>

	</StyledWrapper>

export default AccountItem;

const StyledWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 12px;
`

const FlexWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0 6px;
`

const StyledName = styled.div`
	color: #00aafa;
	text-transform: uppercase;
	font-style: italic;
	font-weight: bold;
	line-height: 20px;
	overflow: hidden;
	text-overflow: ellipsis;
`

const StyledBalance = styled.div`
	color: #827a7a;
	font-size: 1.3em;
	line-height: 22px;
	text-overflow: ellipsis;
`

const StyledBalanceEther = styled.span`
	font-size: 0.6em;
`

const StyledAddress = styled.div`
	color: rgba(130, 122, 122, 0.6);
	font-size: 0.8em;
	line-height: 1.4em;
`
