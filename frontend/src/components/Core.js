import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';
import { ethers } from 'ethers';

import App   from './App';
import Login from './Login';
import Error from './Error';

import config from '../config.json';

const Core = () =>
{
	const [ env,    setEnv    ] = React.useState({});
	const [ client, setClient ] = React.useState(null);

	// web3 provider
	const setup = async () =>
	{
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		setEnv({
			provider,
			accounts: await provider.listAccounts(),
			network:  await provider.getNetwork(),
		});
	}

	const connect = () =>
	{
		window.ethereum.enable().then(account => {
			setup();
			window.ethereum.on('accountsChanged', setup);
			window.ethereum.on('networkChanged',  setup);
		})
	}

	// Hooks
	React.useEffect(() => { setTimeout(connect, 100) }, []);
	React.useEffect(() => {
		try
		{
			const uri     = config.networks[env.network.name].endpoint
			const cache   = new InMemoryCache();
			const link    = new HttpLink({ uri });
			const client  = new ApolloClient({ cache, link });
			setClient(client);
		}
		catch
		{
			setClient(null);
		}
	}, [ env ]);

	return (
		env.provider === undefined
		? <Login callback={ connect }/>
		: client === null
		? <Error message='Wrong network, use rinkeby'/>
		: <ApolloProvider client={ client }><App { ...env }/></ApolloProvider>
	);
}

export default Core;
