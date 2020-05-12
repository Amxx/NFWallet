import { ethers } from 'ethers';
import NFWallet   from '../abi/NFWallet.json';


const BNmin = (x,y) => x.lte(y) ? x : y;
const BNmax = (x,y) => x.gte(y) ? x : y;

const toShortAddress = (entry) => `${entry.substr(0,6)}...${entry.substr(-4)}`;


const formatTransaction = ({
	address,
	value,
	data,
	artefact,
	method,
	args,
}) => ([
	address,
	value || ethers.constants.Zero,
	artefact ? (new ethers.utils.Interface(artefact.abi)).functions[method].encode(args || []) : data || '0x',
])

const executeTransactions = (
	wallet,
	txs,
	services,
	callbacks = {}
) => executePromise(
	(new ethers.Contract(wallet, NFWallet.abi, (services.gsnProvider || services.provider).getSigner())).forwardBatch(txs.filter(Boolean).map(formatTransaction)),
	services,
	callbacks
);

const executePromise = (
	promise,
	services,
	callbacks = {}
) => new Promise((resolve, reject) => {
	promise.then(txPromise => {
		callbacks.sent
		? callbacks.sent()
		: services.emitter.emit('Notify', 'info', 'Transaction sent');
		txPromise.wait()
		.then(tx => {
			resolve({ case: 0, tx });
			services.emitter.emit('tx');
			callbacks.mined
			? callbacks.mined(tx)
			: services.emitter.emit('Notify', 'success', 'Transaction successfull');
		}) // success
		.catch(err => {
			resolve({ case: 1, err });
			callbacks.failled
			? callbacks.failled(err)
			: services.emitter.emit('Notify', 'error', 'Transaction failled');
		}) // transaction error
	})
	.catch(err => {
		resolve({ case: 2, err });
		callbacks.sigerror
		? callbacks.sigerror(err)
		: services.emitter.emit('Notify', 'error', 'Signature required');
	}) // signature error
});

export {
	BNmin,
	BNmax,
	toShortAddress,
	formatTransaction,
	executeTransactions,
	executePromise,
};
