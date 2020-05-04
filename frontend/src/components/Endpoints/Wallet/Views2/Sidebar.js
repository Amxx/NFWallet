import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab  from '@material-ui/core/Tab';
import {ethers} from 'ethers';

const Sidebar = (props) =>
	<div className={props.className} style={{fontSize: '.8em'}}>
		<div className='bb px-4 py-3'>
			<Tabs
				orientation='vertical'
				variant='scrollable'
				value={props.active}
				indicatorColor="primary"
				onChange={(e,v) => props.change(v)}
			>
				{
					props.tabList.map(({label, icon}, i) => <Tab key={i} label={label} icon={icon}/>)
				}
			</Tabs>
		</div>

		<div className='bb px-4 py-3'>
			<div className='mb-2 text-muted font-weight-bold' style={{fontSize: '1.2em'}}>
				My assets
			</div>
			<table>
				<tbody>
				{
					Object.values(props.details.tokens).map((token, i) =>
						<tr key={i}>
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
				</tbody>
			</table>
		</div>

		{
			[
				{
					name: 'positions',
					entries :
					[
						{
							label:    'AAVE',
							selector: ({aave}) => aave && aave.aTokenBalance.gt(0),
							balance:  ({aave}) => aave.aTokenBalance,
						},
						{
							label:    'Compound',
							selector: ({compound}) => compound && compound.cTokenBalance.gt(0),
							balance:  ({compound}) => compound.cTokenBalance.mul(compound.exchangeRateStored).div(ethers.constants.WeiPerEther),
						},
					]
				},
				{
					name: 'loans',
					entries:
					[
						{
							label:    'AAVE',
							selector: ({aave}) => aave && aave.borrowBalance.gt(0),
							balance:  ({aave}) => aave.borrowBalance,
						},
						{
							label:    'Compound',
							selector: ({compound}) => compound && compound.borrowBalance.gt(0),
							balance:  ({compound}) => compound.borrowBalance,
						},
					]
				}
			]
			.map((block) => ({name: block.name, entries: block.entries.map((entry) => ({...entry, elements: Object.values(props.details.tokens).filter(entry.selector)})).filter(({elements}) => elements.length)}))
			.map((block, i) =>
				<div key={i} className='bb px-4 py-3'>
					<div className='mb-2 text-muted font-weight-bold' style={{fontSize: '1.2em'}}>
						My {block.name}
					</div>
					<table>
						{
							block.entries.map((entry, j) =>
								<>
									<thead>
										<tr><td colSpan={3} className='text-center text-muted' style={{fontSize: '.8em'}}>{entry.label}</td></tr>
									</thead>
									<tbody>
									{
										entry.elements.map((token, k) =>
											<tr key={k}>
												<td>
													<img src={token.img} height={24} alt={token.symbol}/>
												</td>
												<td className='p-2 text-left'>
													<strong>{token.symbol}</strong>
												</td>
												<td className='p-2 text-right'>
													<span>{Number(ethers.utils.formatUnits(entry.balance(token), token.decimals)).toFixed(3)}</span>
												</td>
											</tr>
										)
									}
									</tbody>
								</>
							)
						}
						{
							!block.entries.length &&
							<thead><tr><td className='text-center text-muted'>No active {block.name}</td></tr></thead>
						}
					</table>
				</div>
			)
		}
	</div>

export default Sidebar;
