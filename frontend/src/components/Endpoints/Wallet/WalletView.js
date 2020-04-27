import * as React from 'react';
import { MDBCol, MDBRow } from 'mdbreact';

import CardWrapper           from '../../UI/CardWrapper';
// import ExpansionWrapper      from '../../UI/ExpansionWrapper';
import WalletActivity        from '../../Views/WalletActivity';
import WalletBalances        from '../../Views/WalletBalances';
import WalletBalanceChart    from '../../Views/WalletBalanceChart';
import WalletDetailsExpanded from '../../Views/WalletDetailsExpanded';
import WalletTrade           from '../../Views/WalletTrade';
import WalletTX              from '../../Views/WalletTX';


const WalletView = (props) =>
	<>
		<MDBRow>
		<MDBCol size='12' className='p-0'>

			<CardWrapper className='p-2'>
				<WalletDetailsExpanded
					data={props.data}
					balances={props.balances}
					services={props.services}
				/>
			</CardWrapper>

		</MDBCol>
		</MDBRow>
		<MDBRow className='flex-row-reverse'>
		<MDBCol lg='6' md='12' className='p-0'>

			<CardWrapper className='p-2' title='Send'>
				<WalletTX
					data={props.data}
					balances={props.balances}
					services={props.services}
				/>
			</CardWrapper>

			<CardWrapper className='p-2' title='Exchange'>
				<WalletTrade
					data={props.data}
					balances={props.balances}
					services={props.services}
				/>
			</CardWrapper>

		</MDBCol>
		<MDBCol lg='6' md='12' className='p-0'>

			<CardWrapper className='p-2' title='Balances'>
				<WalletBalances
					data={props.data}
					balances={props.balances}
					services={props.services}
				/>
			</CardWrapper>

			<CardWrapper className='p-2' title='Balance chart'>
				<WalletBalanceChart
					data={props.data}
					balances={props.balances}
					services={props.services}
				/>
			</CardWrapper>

			<CardWrapper className='p-2' title='Activity logs'>
				<WalletActivity
					data={props.data}
					balances={props.balances}
					services={props.services}
				/>
			</CardWrapper>

		</MDBCol>
		</MDBRow>
	</>

export default WalletView;
