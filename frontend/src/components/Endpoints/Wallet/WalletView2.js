import * as React from 'react';

import TabSlider        from '../../UI/TabSlider';
import Sidebar          from './Views2/Sidebar';
import Details          from './Views2/Details';
import Send             from './Views2/Send';
import Transfer         from './Views2/Transfer';
import Swap             from './Views2/Swap';
import History          from './Views2/History';

import WalletAAVEOverview        from './Views/WalletAAVEOverview';
import WalletAAVELending         from './Views/WalletAAVELending';
import WalletAAVEBorrowing       from './Views/WalletAAVEBorrowing';
import WalletAAVERepaying        from './Views/WalletAAVERepaying';
import WalletAAVEHealth          from './Views/WalletAAVEHealth';
import WalletCompoundOverview    from './Views/WalletCompoundOverview';
import WalletCompoundLending     from './Views/WalletCompoundLending';
import WalletCompoundBorrowing   from './Views/WalletCompoundBorrowing';
import WalletCompoundRepaying    from './Views/WalletCompoundRepaying';
import WalletCompoundHealth      from './Views/WalletCompoundHealth';


const Aave = (props) =>
	Object.values(props.details.tokens).find(({compound}) => compound)
	?
		<TabSlider
			// scrollable
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
		<div className='text-center text-muted p-4'>Compound is not available on this network</div>


const Compound = (props) =>
	Object.values(props.details.tokens).find(({compound}) => compound)
	?
		<TabSlider
			// scrollable
			entries={[
				{ label: 'Overview',             render: <WalletCompoundOverview               {...props} /> },
				{ label: 'Deposit',              render: <WalletCompoundLending fixed          {...props} /> },
				{ label: 'Withdraw',             render: <WalletCompoundLending fixed withdraw {...props} /> },
				{ label: 'Borrow',               render: <WalletCompoundBorrowing              {...props} /> },
				{ label: 'Repay',                render: <WalletCompoundRepaying               {...props} /> },
				{ label: 'Health',               render: <WalletCompoundHealth                 {...props} /> },
			]}
		/>
	:
		<div className='text-center text-muted p-4'>Compound is not available on this network</div>


const WalletView = (props) =>
{
	const [ active, setActive ] = React.useState(1);
	const tabList = [
		{ label: 'Details',  icon: null, render: <Details  {...props}/> },
		{ label: 'Swap',     icon: null, render: <Swap     {...props}/> },
		{ label: 'Send',     icon: null, render: <Send     {...props}/> },
		{ label: 'Transfer', icon: null, render: <Transfer {...props}/> },
		{ label: 'AAVE',     icon: null, render: <Aave     {...props}/> },
		{ label: 'Compound', icon: null, render: <Compound {...props}/> },
		{ label: 'History',  icon: null, render: <History  {...props}/> },
	]

	return (
		<div className='flex-grow-1 d-flex'>
			<Sidebar tabList={tabList} active={active} change={setActive} className='darktheme-light text-white br' {...props}/>
			<div className={ 'darktheme-bg flex-grow-1 d-flex flex-column'}>
			{
				tabList.map(({label, render}, i) => active === i && render && React.cloneElement(render, { key: i }))
			}
			</div>
		</div>
	);
}

export default WalletView;
