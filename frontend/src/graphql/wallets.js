import gql from 'graphql-tag';

export default gql`
query wallets($account: String, $first: Int, $skip: Int)
{
	entries: nfwallets(first: $first, skip: $skip, where: { owner: $account })
	{
		id
		owner
		{
			id
		}
	}
}
`
