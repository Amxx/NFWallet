import { ethers } from 'ethers';
import NFWallet   from '../abi/NFWallet.json';

const toShortAddress = (entry) => `${entry.substr(0,6)}...${entry.substr(-4)}`;

const executeTransactions = (
	wallet,
	txs,
	services,
	callbacks = {}
) => new Promise((resolve, reject) => {

	(new ethers.Contract(wallet, NFWallet.abi, services.provider.getSigner()))
	.forwardBatch(txs.filter(Boolean))
	.then(txPromise => {
		callbacks.sent && callbacks.sent();
		services.emitter.emit('Notify', 'info', 'Transaction sent');
		txPromise.wait()
		.then(tx => {
			resolve({ case: 0, tx });
			callbacks.mined && callbacks.mined(tx);
			services.emitter.emit('Notify', 'success', 'Transaction successfull');
			services.emitter.emit('tx');
		}) // success
		.catch(err => {
			resolve({ case: 1, err });
			callbacks.failled && callbacks.failled(err);
			services.emitter.emit('Notify', 'error', 'Transaction failled');
		}) // transaction error
	})
	.catch(err => {
		resolve({ case: 2, err });
		callbacks.sigerror && callbacks.sigerror(err);
		services.emitter.emit('Notify', 'error', 'Signature required');
	}) // signature error
})

export {
	toShortAddress,
	executeTransactions,
};
