import {NetworkConnector} from '@web3-react/network-connector';
import {InjectedConnector} from '@web3-react/injected-connector'
import {WalletConnectConnector} from '@web3-react/walletconnect-connector'

import {INFURA_PREFIXES} from './utils';

export function getNetwork(defaultChainId=1):NetworkConnector {
    return new NetworkConnector({
        urls:[1,3,4,5,42].reduce(
            (urls,chainId) => {
                return Object.assign(urls, {
                    [chainId] : `https://${INFURA_PREFIXES[chainId]}.infura.io/v3/79afc96778564bdf97fc989ed9310e32`
                })
            },{}
        ),
        defaultChainId
    })
}

export const injected = new InjectedConnector({supportedChainIds:[1,3,4,5,42]})

export const walletconnect = new WalletConnectConnector({
    rpc:{
        1: `https://${INFURA_PREFIXES[1]}.infura.io/v3/79afc96778564bdf97fc989ed9310e32`
    },
    bridge: 'https://bridge.walletconnect.org'
})


