import * as React from 'react';
import { MDBCard, MDBCol, MDBRow } from 'mdbreact';

import TabSlider             from '../../UI/TabSlider';
import WalletActivity        from '../../Views/WalletActivity';
import WalletBalances        from '../../Views/WalletBalances';
import WalletBalanceChart    from '../../Views/WalletBalanceChart';
import WalletBorrowing       from '../../Views/WalletBorrowing';
import WalletDetailsExpanded from '../../Views/WalletDetailsExpanded';
import WalletLending         from '../../Views/WalletLending';
import WalletOwnership       from '../../Views/WalletOwnership';
// import WalletRepay           from '../../Views/WalletRepay';
import WalletSend            from '../../Views/WalletSend';
import WalletUniswapV2       from '../../Views/WalletUniswapV2';


const WalletView = (props) =>
	<>
		<MDBRow>
		<MDBCol size='12' className='p-0'>

			<div className='py-3'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Details',              render: <WalletDetailsExpanded {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='py-3'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Send',                 render: <WalletSend            {...props}/> },
							{ label: 'Swap',                 render: <WalletUniswapV2       {...props}/> },
							{ label: 'Wallet ownership',     render: <WalletOwnership       {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='py-3'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Lend',                 render: <WalletLending         {...props} /> },
							{ label: 'Borrow',               render: <WalletBorrowing       {...props} /> },
							{ label: 'Repay',                render: null },
						]}
					/>
				</MDBCard>
			</div>

			<div className='py-3'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Balances',             render: <WalletBalances        {...props}/> },
							{ label: 'Chart',                render: <WalletBalanceChart    {...props}/> },
							{ label: 'Detailed activity',    render: <WalletActivity        {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

		</MDBCol>
		</MDBRow>
	</>

export default WalletView;
