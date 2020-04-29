import { ethers } from 'ethers';
import NFWallet   from '../abi/NFWallet.json';

const toShortAddress = (entry) => `${entry.substr(0,6)}...${entry.substr(-4)}`;

const executeTransactions = (
	wallet,
	txs,
	services,
	callbacks = {}
) => {
	(new ethers.Contract(wallet, NFWallet.abi, services.provider.getSigner()))
	.forwardBatch(txs.filter(Boolean))
	.then(txPromise => {
		callbacks.sent && callbacks.sent()
		services.emitter.emit('Notify', 'info', 'Transaction sent');
		txPromise.wait()
		.then(() => {
			callbacks.mined && callbacks.mined()
			services.emitter.emit('Notify', 'success', 'Transaction successfull');
			services.emitter.emit('tx');
		}) // success
		.catch(() => {
			callbacks.failled && callbacks.failled()
			services.emitter.emit('Notify', 'error', 'Transaction failled');
		}) // transaction error
	})
	.catch(() => {
		callbacks.sigerror && callbacks.sigerror()
		services.emitter.emit('Notify', 'error', 'Signature required');
	}) // signature error
}

export {
	toShortAddress,
	executeTransactions,
};
