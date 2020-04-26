import * as React from 'react'
import styled from 'styled-components'

const AccountItem = (props) =>
	<StyledWrapper>
		<FlexWrapper>
			<img src={props.token.img} height={32} alt={props.token.symbol}/>
		</FlexWrapper>
		<FlexWrapper>
			<StyledName>
				{props.token.name}
			</StyledName>
			<StyledBalance>
				{props.token.balance} <StyledBalanceEther>{props.token.symbol}</StyledBalanceEther>
			</StyledBalance>
		</FlexWrapper>
	</StyledWrapper>

export default AccountItem;

const StyledWrapper = styled.div`
	display: flex;
	width: 220px;
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
	text-align: left;
`

const StyledBalanceEther = styled.span`
	font-size: 0.6em;
`
