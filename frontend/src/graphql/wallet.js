import gql from 'graphql-tag';

export default gql`
query wallet($wallet: String)
{
	wallet: nfwallet(id: $wallet)
	{
		id
		owner { id }
		balance
		events(first: 1000, orderBy: timestamp, orderDirection: desc)
		{
			__typename
			id
			timestamp
			transaction { id }
		}
	}
	balanceOut: executeds(first: 1000, orderBy: timestamp, orderDirection: desc, where: { wallet: $wallet, value_gt: 0 })
	{
		timestamp
		value
	}
	balanceIn: receiveds(first: 1000, orderBy: timestamp, orderDirection: desc, where: { wallet: $wallet, value_gt: 0 })
	{
		timestamp
		value
	}
	creation: transfers(first: 1, orderBy: timestamp, orderDirection: asc, where: { wallet: $wallet })
	{
		timestamp
	}
}
`
// ... on Transfer
// {
// 	from { id }
// 	to   { id }
// }
// ... on Received
// {
// 	from { id }
// 	value
// }
// ... on Executed
// {
// 	to { id }
// 	value
// }
