import {
	ethereum,
} from '@graphprotocol/graph-ts'

import {
	Transfer as TransferEvent,
} from '../generated/NFWalletFactory/NFWalletFactory'

import {
	Account,
	Token,
	Transaction,
	Transfer,
} from '../generated/schema'



export function createEventID(event: ethereum.Event): string
{
	return event.block.number.toString().concat('-').concat(event.logIndex.toString())
}

export function logTransaction(event: ethereum.Event): Transaction
{
	let from = new Account(event.transaction.from.toHex());
	let to   = new Account(event.transaction.to.toHex());
	let tx   = new Transaction(event.transaction.hash.toHex());

	tx.from        = from.id;
	tx.to          = to.id;
	tx.value       = event.transaction.value;
	tx.gasUsed     = event.transaction.gasUsed;
	tx.gasPrice    = event.transaction.gasPrice;
	tx.timestamp   = event.block.timestamp;
	tx.blockNumber = event.block.number;

	from.save();
	to.save();
	tx.save();

	return tx as Transaction;
}



export function handleTransfer(event: TransferEvent): void {
	let token    = new Token(event.params.tokenId.toString());
	let from     = new Account(event.params.from.toHex());
	let to       = new Account(event.params.to.toHex());
	let transfer = new Transfer(createEventID(event));

	token.owner = to.id;

	transfer.transaction = logTransaction(event).id;
	transfer.timestamp   = event.block.timestamp;
	transfer.token       = token.id;
	transfer.from        = from.id;
	transfer.to          = to.id;

	token.save();
	from.save();
	to.save();
	transfer.save();
}
