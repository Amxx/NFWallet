import {
	BigInt,
} from '@graphprotocol/graph-ts'

import {
	Transfer as TransferEvent,
} from '../generated/NFWalletFactory/NFWalletFactory'

import {
	NFWallet as NFWalletTemplate,
} from '../generated/templates'

import {
	Account,
	NFWallet,
	Transfer,
} from '../generated/schema'

import {
	createEventID,
	logTransaction,
	intToAddress,
} from './utils'

export function handleTransfer(event: TransferEvent): void {
	let addr     = intToAddress(event.params.tokenId);
	let wallet   = new NFWallet(addr.toHex());
	let from     = new Account(event.params.from.toHex());
	let to       = new Account(event.params.to.toHex());
	let transfer = new Transfer(createEventID(event));

	wallet.owner = to.id;

	if (from.id == '0x0000000000000000000000000000000000000000')
	{
		NFWalletTemplate.create(addr);
		wallet.balance = BigInt.fromI32(0);
	}

	transfer.transaction = logTransaction(event).id;
	transfer.timestamp   = event.block.timestamp;
	transfer.wallet      = wallet.id;
	transfer.from        = from.id;
	transfer.to          = to.id;

	wallet.save();
	from.save();
	to.save();
	transfer.save();
}
