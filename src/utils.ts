import {
	Address,
	BigInt,
	BigDecimal,
	ethereum,
} from '@graphprotocol/graph-ts'

import {
	Account,
	Transaction,
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

export function intToAddress(value: BigInt): Address
{
	return Address.fromHexString(value.toHex().substr(2).padStart(40, '0')) as Address;
}

export function toETH(value: BigInt): BigDecimal
{
	return value.divDecimal(BigDecimal.fromString('1000000000000000000'))
}
