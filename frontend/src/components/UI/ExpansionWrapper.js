import * as React from 'react';
import ExpansionPanel        from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';


const ExpansionWrapper = (props) =>
	<ExpansionPanel className={props.className}>
		<ExpansionPanelSummary>
			{ props.title }
		</ExpansionPanelSummary>
		<ExpansionPanelDetails className={props.center && 'd-flex justify-content-center align-items-center'}>
			{ props.children }
		</ExpansionPanelDetails>
	</ExpansionPanel>

export default ExpansionWrapper;
