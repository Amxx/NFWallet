import {
	Received as ReceivedEvent,
	Executed as ExecutedEvent,
} from '../generated/templates/NFWallet/NFWallet'

import {
	Transaction,
	Account,
	NFWallet,
	Received,
	Executed,
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

	wallet.balance += toETH(event.params.value);

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
	let wallet   = NFWallet.load(event.address.toHex());
	let executed = new Executed(createEventID(event));
	let to       = new Account(event.params.to.toHex());

	wallet.balance -= toETH(event.params.value);

	executed.transaction = logTransaction(event).id;
	executed.timestamp   = event.block.timestamp;
	executed.wallet      = event.address.toHex();
	executed.to          = to.id;
	executed.value       = toETH(event.params.value);
	executed.data        = event.params.data;

	wallet.save();
	executed.save();
	to.save();
}
