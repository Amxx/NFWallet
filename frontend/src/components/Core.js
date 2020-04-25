import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';
import { EventEmitter   } from 'fbemitter';
import { ethers         } from 'ethers';
import LoginWithEthereum  from '../libs/login-with-ethereum';

import Notifications from './Notifications';
import Main  from './Main';
import Error from './Error';

import { abi as ABIFactory } from '../abi/NFWalletFactory.json';

import config from '../config.json';



const Core = () =>
{
	const emitter = new EventEmitter();
	const [ services, setServices ] = React.useState(null);
	const [ client,   setClient   ] = React.useState(null);

	const setup = async (web3) => {
		try
		{
			const provider = new ethers.providers.Web3Provider(web3)
			const registry = new ethers.Contract('nfwallets.eth', ABIFactory, provider.getSigner());
			const accounts = await provider.listAccounts()
			const network  = await provider.getNetwork()
			registry.addressPromised = await registry.addressPromise;

			setServices({ provider, accounts, network, registry, emitter });
			try
			{
				const uri     = config.networks[network.name].endpoint
				const cache   = new InMemoryCache();
				const link    = new HttpLink({ uri });
				const client  = new ApolloClient({ cache, link });
				setClient(client);
			}
			catch
			{
				setClient(null);
			}
		}
		catch (_)
		{
			setServices(null);
			setClient(null);
		}
	}

	const connect = (web3) => {
		emitter.emit('Notify', 'success', 'You are connected');
		web3.on('accountsChanged', () => setup(web3));
		web3.on('networkChanged',  () => setup(web3));
		web3.autoRefreshOnNetworkChange = false;
		setup(web3);
	}

	const disconnect = () => {
		emitter.emit('Notify', 'warning', 'You are disconnect');
		setup(null);
	}

	return (
		<>
			<Notifications emitter={emitter}/>
			<LoginWithEthereum
				className    = { services ? 'connected' : 'disconnected' }
				config       = { config.enslogin                         }
				connect      = { connect                                 }
				disconnect   = { disconnect                              }
				startVisible = { true                                    }
			/>
			{
				services &&
				(
					client
					? <ApolloProvider client={ client }><Main { ...services }/></ApolloProvider>
					: <Error message='Please switch network to a supported network (only rinkeby for now)'/>
				)
			}
		</>
	);
}

export default Core;
