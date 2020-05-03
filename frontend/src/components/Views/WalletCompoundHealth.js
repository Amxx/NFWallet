import * as React from 'react';
import Grid  from '@material-ui/core/Grid';

import { ethers } from 'ethers';


const WalletCompoundHealth = (props) =>
	<Grid container direction='column' alignItems='center'>
		{
			[
				props.details.account.compound.accountLiquidity.gt(0) && {
					items: [
						<strong>Safe</strong>,
						`${ethers.constants.EtherSymbol} ${Number(ethers.utils.formatUnits(props.details.account.compound.accountLiquidity, 36)).toFixed(9)}`,
						<small>(Liquidity)</small>,
					],
					className: 'green-text',
				},
				props.details.account.compound.shortfall.gt(0) && {
					items: [
						<strong>Danger</strong>,
						`${ethers.constants.EtherSymbol} ${Number(ethers.utils.formatUnits(props.details.account.compound.shortfall, 36)).toFixed(9)}`,
						<small>(Shortfall)</small>,
					],
					className: 'red-text',
				},
			].filter(Boolean)
			.map((entry, i) => <> { entry.items.map((item, i) => <Grid item key={i} className={entry.className}>{item}</Grid>) } </>)
		}
	</Grid>

export default WalletCompoundHealth;
