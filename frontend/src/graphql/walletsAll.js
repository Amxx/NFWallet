import gql from 'graphql-tag';

export default gql`
query walletsAll($first: Int, $skip: Int)
{
	entries: nfwallets(first: $first, skip: $skip)
	{
		id
		owner
		{
			id
		}
	}
}
`
