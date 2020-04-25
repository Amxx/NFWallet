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
