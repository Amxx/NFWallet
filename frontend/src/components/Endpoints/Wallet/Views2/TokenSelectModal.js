import * as React from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

const TokenSelectModal = (props) =>
{
	const [ visible, setVisible ] = React.useState(false);

	return (
		<>
			<div onClick={() => props.tokens.length && setVisible(true)} className={props.className} style={{cursor: props.tokens.length && 'pointer'}}>
				{props.children}
			</div>
			<Modal open={visible} onClose={() => setVisible(false)}>
				<Paper elevation={3} className='p-5' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
				{
					props.tokens.map((token, i) =>
						<div key={i} className='p-3'>
							<a href='#!' onClick={() => { props.onChange && props.onChange(token); setVisible(false); }}>
								<img src={token.img} height={32} alt={token.symbol}/><strong className='ml-2'>{token.symbol}</strong>
							</a>
						</div>
					)
				}
				</Paper>
			</Modal>
		</>
	);
}

export default TokenSelectModal;
