import * as React from 'react';
import { MDBBtn, MDBIcon } from 'mdbreact';

import Modal                     from '@material-ui/core/Modal';
import Grid                      from '@material-ui/core/Grid';
import Paper                     from '@material-ui/core/Paper';
import TextField                 from '@material-ui/core/TextField';
import Tabs                      from '@material-ui/core/Tabs';
import Tab                       from '@material-ui/core/Tab';

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
import WalletCompoundHealth      from '../../Views/WalletCompoundHealth';
import WalletBalances            from '../../Views/WalletBalances';
import WalletBalanceChart        from '../../Views/WalletBalanceChart';
import WalletDetailsExpanded     from '../../Views/WalletDetailsExpanded';
import WalletOwnership           from '../../Views/WalletOwnership';
import WalletSend                from '../../Views/WalletSend';
import WalletUniswapV2           from '../../Views/WalletUniswapV2';

import {ethers} from 'ethers';
import BalanceInput from '../../UI/BalanceInput';


import QRCode from 'qrcode.react';










const TabPanel = (props) => props.value === props.index && <div className={props.className}>{props.children }</div>;










const TokenSelectModal = (props) =>
{
	const [ visible, setVisible ] = React.useState(false);

	return (
		<>
			<div onClick={() => setVisible(true)} className={props.className} style={{cursor: 'pointer'}}>
				{props.children}
			</div>
			<Modal open={visible} onClose={() => setVisible(false)}>

				<div
					className='darktheme bl br bt bb text-white rounded p-3'
					style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
				>
				{
					props.tokens.map((token, i) =>
						<div key={i} className='m-3'>
							<a href='#!' onClick={() => { props.onChange && props.onChange(token); setVisible(false); }}>
								<img src={token.img} height={32} alt={token.symbol}/><strong className='text-white ml-2'>{token.symbol}</strong>
							</a>
						</div>
					)
				}
				</div>

			</Modal>
		</>
	);
}












const WalletView = (props) =>
{
	const [ token           ] = React.useState(Object.values(props.details.tokens).filter(({UniswapV2})=>UniswapV2));
	const [ base,  setBase  ] = React.useState(props.details.tokens['ETH']);
	const [ quote, setQuote ] = React.useState(token.find(({symbol}) => symbol !== 'ETH'));

	const invert      = ()         => { setBase(quote); setQuote(base); }
	const updateBase  = (newBase ) => { newBase === quote ? invert() : setBase(newBase)   }
	const updateQuote = (newQuote) => { newQuote === base ? invert() : setQuote(newQuote) }



	const [ value, setValue ] = React.useState(0);

	return (
	<div className='flex-grow-1 d-flex darktheme text-white'>

		<div className='d-flex flex-column br' style={{fontSize: '.8em'}}>

			<div className='bb p-4 text-center'>

				Header

			</div>



			<div className='bb p-4'>
				<Tabs
	        orientation='vertical'
	        variant='scrollable'
	        value={value}
					indicatorColor="primary"
	        onChange={(e,v) => setValue(v)}
	      >
	        <Tab label='Send'/>
	        <Tab label='Swap'/>
	        <Tab label='AAVE'/>
	        <Tab label='Compound'/>
	      </Tabs>
			</div>

			<div className='flex-grow-1 p-4'>


				<div className='mb-2 text-muted font-weight-bold' style={{fontSize: '1.2em'}}>
					My assets
				</div>

				<table>
				{
					Object.values(props.details.tokens).map(token =>
						<tr>
							<td>
								<img src={token.img} height={24} alt={token.symbol}/>
							</td>
							<td className='p-2 text-left'>
								<strong>{token.symbol}</strong>
							</td>
							<td className='p-2 text-right'>
								<span>{Number(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(3)}</span>
							</td>

						</tr>
					)
				}
				</table>


			</div>

		</div>













		<TabPanel value={value} index={0} className='flex-grow-1 d-flex p-4 darktheme-dark'>

			<Grid container direction='row' justify='center' alignItems='stretch'>

				<Grid item xs={2} container direction='column' justify='center' alignItems='center'>

<Grid item>

					<div className='p-3 text-center darktheme bl br bt bb font-weight-bold rounded-top'>
						Token to Sell
					</div>

					<TokenSelectModal
						tokens={token}
						onChange={(token) => updateBase(token)}
						className='p-3 text-center darktheme-light bl br'
					>
						<div className='my-2'>
							<img src={base.img} height={32} alt={base.symbol}/><strong className='ml-2'>{base.symbol}</strong>
						</div>
						<div className='text-muted'>
							{Number(ethers.utils.formatUnits(base.balance, base.decimals)).toFixed(3)}
						</div>
					</TokenSelectModal>

					<div className='p-3 text-center darktheme-light bl br bt bb rounded-bottom'>
						<TextField/>
					</div>
					</Grid>

				</Grid>

				<Grid item xs={2} container direction='column' justify='space-evenly' alignItems='center'>

					<Grid item style={{visibility: 'hidden'}}>
						<MDBBtn>Swap</MDBBtn>
					</Grid>

					<Grid item>
						<a href='#!' onClick={invert}>
							<MDBIcon icon='exchange-alt'/>
						</a>
					</Grid>

					<Grid item>
						<MDBBtn color='light' className='darktheme-light' outline>
							Swap
						</MDBBtn>
					</Grid>

				</Grid>

				<Grid item xs={2} container direction='column' justify='center' alignItems='center'>

					<Grid item>
					<div className='p-3 text-center darktheme bl br bt bb font-weight-bold rounded-top'>
						Token to Buy
					</div>

					<TokenSelectModal
						tokens={token}
						onChange={(token) => updateQuote(token)}
						className='p-3 text-center darktheme-light bl br'
					>
						<div className='my-2'>
							<img src={quote.img} height={32} alt={quote.symbol}/><strong className='ml-2'>{quote.symbol}</strong>
						</div>
						<div className='text-muted'>
							{Number(ethers.utils.formatUnits(quote.balance, quote.decimals)).toFixed(3)}
						</div>
					</TokenSelectModal>

					<div className='p-3 text-center darktheme-light bl br bt bb rounded-bottom'>
						<TextField/>
					</div>
					</Grid>

				</Grid>

			</Grid>

		</TabPanel>

		<TabPanel value={value} index={1} className='flex-grow-1 d-flex p-4 darktheme-dark'>
			toto
		</TabPanel>



	</div>
	);
}



export default WalletView;
