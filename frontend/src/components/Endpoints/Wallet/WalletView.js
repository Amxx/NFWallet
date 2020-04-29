import * as React from 'react';
import { MDBCard, MDBCol, MDBRow } from 'mdbreact';

import TabSlider             from '../../UI/TabSlider';
import WalletActivity        from '../../Views/WalletActivity';
import WalletBalances        from '../../Views/WalletBalances';
import WalletBalanceChart    from '../../Views/WalletBalanceChart';
import WalletDetailsExpanded from '../../Views/WalletDetailsExpanded';
import WalletTradeUniswapV2  from '../../Views/WalletTradeUniswapV2';
import WalletTransfer        from '../../Views/WalletTransfer';
import WalletTX              from '../../Views/WalletTX';


const WalletView = (props) =>
	<>
		<MDBRow>
		<MDBCol size='12' className='p-0'>

			<div className='py-3'>
				<MDBCard>
					<TabSlider
						entries={[
							{ label: 'Details',              render: () => <WalletDetailsExpanded {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='py-3'>
				<MDBCard>
					<TabSlider
						entries={[
							{ label: 'ETH & ERC20',          render: () => <WalletTX              {...props}/> },
							{ label: 'UniswapV2',            render: () => <WalletTradeUniswapV2  {...props}/> },
							{ label: 'AAVE', },
							{ label: 'Transfer this wallet', render: () => <WalletTransfer        {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='py-3'>
				<MDBCard>
					<TabSlider
						entries={[
							{ label: 'Balances',             render: () => <WalletBalances        {...props}/> },
							{ label: 'Chart',                render: () => <WalletBalanceChart    {...props}/> },
							{ label: 'Detailed activity',    render: () => <WalletActivity        {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

		</MDBCol>
		</MDBRow>
	</>

export default WalletView;
