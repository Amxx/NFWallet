import * as React from 'react';
import {ethers}   from 'ethers';
import Paper            from '@material-ui/core/Paper';
import TokenSelectModal from './TokenSelectModal';
import AddressInputENS  from '../../../UI/AddressInputENS';
import BalanceInput     from '../../../UI/BalanceInput';

const SwapToken = (props) =>
	<div className={props.className} style={props.style}>
		<Paper square elevation={3} className='text-center p-3 rounded-top font-weight-bold'>
			{props.title}
		</Paper>
		<Paper square elevation={3} className='text-center p-3'>
			<TokenSelectModal tokens={props.tokenList} onChange={props.onChange}>
				<div>
					<img src={props.token.img} height={32} alt={props.token.symbol}/>
					<span className='ml-2'>{ props.token.symbol }</span>
				</div>
				<div>
					<span className='text-muted'>{Number(ethers.utils.formatUnits(props.token.balance, props.token.decimals)).toFixed(3)}</span>
				</div>
			</TokenSelectModal>
		</Paper>
		<Paper square elevation={3} className='text-center p-3 rounded-bottom'>
			{
				props.setAddress &&
				<AddressInputENS
					className   = 'w-100 mb-2'
					color       = 'light'
					label       = 'destination'
					onChange    = {props.setAddress}
					provider    = {props.services.provider}
				/>
			}
			{
				!props.noValue &&
				<BalanceInput
					className     = 'w-100'
					value         = {props.value}
					tokenDecimals = {props.token.decimals}
					tokenBalance  = {!props.value && props.token.balance}
					callbacks     = {{setAmount: props.setAmount, setEnough: props.setEnough}}
					disabled      = {props.disabled}
				/>
			}
		</Paper>
	</div>

export default SwapToken;
