import {
	Received as ReceivedEvent,
	Executed as ExecutedEvent,
} from '../generated/templates/NFWallet/NFWallet'

import {
	Account,
	NFWallet,
	Received,
} from '../generated/schema'

import {
	createEventID,
	logTransaction,
	toETH,
} from './utils'

export function handleReceived(event: ReceivedEvent): void {
	let wallet   = NFWallet.load(event.address.toHex());
	let received = new Received(createEventID(event));
	let from     = new Account(event.params.from.toHex());


	received.transaction = logTransaction(event).id;
	received.timestamp   = event.block.timestamp;
	received.wallet      = event.address.toHex();
	received.from        = from.id;
	received.value       = toETH(event.params.value);

	wallet.save();
	received.save();
	from.save();
}

export function handleExecuted(event: ExecutedEvent): void {
	let wallet = NFWallet.load(event.address.toHex());

	wallet.balance += toETH(event.params.value);

	wallet.save();
}
