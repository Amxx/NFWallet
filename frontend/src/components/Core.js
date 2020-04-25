import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';
import { EventEmitter   } from 'fbemitter';
import { ethers         } from 'ethers';
import LoginWithEthereum  from '../libs/login-with-ethereum';

import Main          from './Main';
import Error         from './UI/Error';
import Notifications from './Services/Notifications';

import { abi as ABIFactory } from '../abi/NFWalletFactory.json';

import CONFIG from '../config.json';



const Core = () =>
{
	const emitter = new EventEmitter();
	const [ services, setServices ] = React.useState(null);
	const [ client,   setClient   ] = React.useState(null);

	const setupServices = async (web3) => {
		try
		{
			const provider = new ethers.providers.Web3Provider(web3)
			const accounts = await provider.listAccounts()
			const network  = await provider.getNetwork()
			const config   = CONFIG.networks[network.name]
			const registry = new ethers.Contract(config.nfwfactory, ABIFactory, provider.getSigner());

			registry.addressPromise.then(addr => registry.addressPromised = addr).catch(() => {});

			setServices({
				provider,
				network,
				accounts,
				registry,
				emitter,
				config,
			});
			setupSubgraph(config);
		}
		catch (_)
		{
			setServices(null);
		}
	}

	const setupSubgraph = async (subconfig) => {
		if (subconfig)
		{
			const uri     = subconfig.subgraph;
			const cache   = new InMemoryCache();
			const link    = new HttpLink({ uri });
			const client  = new ApolloClient({ cache, link });
			setClient(client);
		}
		else
		{
			setClient(null);
		}
	}
	
	const connect = (web3) => {
		emitter.emit('Notify', 'success', 'You are connected');
		web3.on('accountsChanged', () => setupServices(web3));
		web3.on('networkChanged',  () => setupServices(web3));
		web3.autoRefreshOnNetworkChange = false;
		setupServices(web3);
	}

	const disconnect = () => {
		emitter.emit('Notify', 'warning', 'You are disconnect');
		setupServices(null);
	}

	return (
		<>
			<Notifications emitter={emitter}/>
			<LoginWithEthereum
				className    = { services ? 'connected' : 'disconnected' }
				config       = { CONFIG.enslogin                         }
				connect      = { connect                                 }
				disconnect   = { disconnect                              }
				startVisible = { true                                    }
			/>
			{
				services &&
				(
					client
					? <ApolloProvider client={client}><Main services={services}/></ApolloProvider>
					: <Error message='Please switch network to a supported network (only rinkeby for now)'/>
				)
			}
		</>
	);
}

export default Core;
