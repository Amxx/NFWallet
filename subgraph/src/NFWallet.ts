import {
	Received as ReceivedEvent,
} from '../generated/templates/NFWallet/NFWallet'

import {
	Account,
	Received,
} from '../generated/schema'

import {
	createEventID,
	logTransaction,
	toETH,
} from './utils'

export function handleReceived(event: ReceivedEvent): void {
	let received = new Received(createEventID(event));
	let from     = new Account(event.params.from.toHex());

	received.transaction = logTransaction(event).id;
	received.timestamp   = event.block.timestamp;
	received.wallet      = event.address.toHex();
	received.from        = from.id;
	received.value       = toETH(event.params.value);

	received.save();
}
