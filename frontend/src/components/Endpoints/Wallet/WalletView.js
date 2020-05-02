import * as React from 'react';
import Grid                      from '@material-ui/core/Grid';
import Paper                     from '@material-ui/core/Paper';
import TabSlider                 from '../../UI/TabSlider';

import WalletActivity            from '../../Views/WalletActivity';
import WalletAAVEOverview        from '../../Views/WalletAAVEOverview';
import WalletAAVELending         from '../../Views/WalletAAVELending';
import WalletAAVEBorrowing       from '../../Views/WalletAAVEBorrowing';
import WalletAAVERepaying        from '../../Views/WalletAAVERepaying';
import WalletAAVEHealth          from '../../Views/WalletAAVEHealth';
import WalletCompoundOverview    from '../../Views/WalletCompoundOverview';
import WalletCompoundLending     from '../../Views/WalletCompoundLending';
import WalletCompoundBorrowing   from '../../Views/WalletCompoundBorrowing';
import WalletCompoundRepaying    from '../../Views/WalletCompoundRepaying';
import WalletBalances            from '../../Views/WalletBalances';
import WalletBalanceChart        from '../../Views/WalletBalanceChart';
import WalletDetailsExpanded     from '../../Views/WalletDetailsExpanded';
import WalletOwnership           from '../../Views/WalletOwnership';
import WalletSend                from '../../Views/WalletSend';
import WalletUniswapV2           from '../../Views/WalletUniswapV2';


const WalletView = (props) =>
	<Grid container spacing={5} direction='column' alignItems='stretch'>

		<Grid item xs/>

		<Grid item xs>
			<Paper square elevation={3}>
				<TabSlider
					entries={[
						{ label: 'Details',              render: <WalletDetailsExpanded {...props}/> },
					]}
				/>
			</Paper>
		</Grid>

		<Grid item xs>
			<Paper square elevation={3}>
				<TabSlider
					entries={[
						{ label: 'Send',                 render: <WalletSend            {...props}/> },
						{ label: 'Swap',                 render: <WalletUniswapV2       {...props}/> },
						{ label: 'Wallet ownership',     render: <WalletOwnership       {...props}/> },
					]}
				/>
			</Paper>
		</Grid>

		<Grid item xs>
			<Paper square elevation={3}>
				<TabSlider
					nopadding
					entries={[
						{
							label: 'AAVE',
							render:
								Object.values(props.details.tokens).find(({aave}) => aave)
								?
									<TabSlider
										scrollable
										entries={[
											{ label: 'Overview',             render: <WalletAAVEOverview               {...props} /> },
											{ label: 'Deposit',              render: <WalletAAVELending fixed          {...props} /> },
											{ label: 'Withdraw',             render: <WalletAAVELending fixed withdraw {...props} /> },
											{ label: 'Borrow',               render: <WalletAAVEBorrowing              {...props} /> },
											{ label: 'Repay',                render: <WalletAAVERepaying               {...props} /> },
											{ label: 'Health',               render: <WalletAAVEHealth                 {...props} /> },
										]}
									/>
								:
									<div className='text-center text-muted p-4'>AAVE is not available on this network</div>
						},
						{
							label: 'Compound',
							render:
								Object.values(props.details.tokens).find(({compound}) => compound)
								?
									<TabSlider
										scrollable
										entries={[
											{ label: 'Overview',             render: <WalletCompoundOverview               {...props} /> },
											{ label: 'Deposit',              render: <WalletCompoundLending fixed          {...props} /> },
											{ label: 'Withdraw',             render: <WalletCompoundLending fixed withdraw {...props} /> },
											{ label: 'Borrow',               render: <WalletCompoundBorrowing              {...props} /> },
											{ label: 'Repay',                render: <WalletCompoundRepaying               {...props} /> },
										]}
									/>
								:
									<div className='text-center text-muted p-4'>Compound is not available on this network</div>
						},
					]}
				/>
			</Paper>
		</Grid>

		<Grid item xs>
			<Paper square elevation={3}>
				<TabSlider
					entries={[
						{ label: 'Balances',             render: <WalletBalances        {...props}/> },
						{ label: 'Chart',                render: <WalletBalanceChart    {...props}/> },
						{ label: 'Detailed activity',    render: <WalletActivity        {...props}/> },
					]}
				/>
			</Paper>
		</Grid>

		<Grid item xs/>

	</Grid>

export default WalletView;
