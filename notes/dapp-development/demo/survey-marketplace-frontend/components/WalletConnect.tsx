import {Button} from '@chakra-ui/core';
import {useWeb3React} from "@web3-react/core";
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { useEffect, useState } from 'react';
import { walletconnect } from '../connectors';


export default function WalletConnect():JSX.Element | null {
const {active, error, activate,setError} = useWeb3React<Web3Provider>()
    
    const [connecting, setConnecting] = useState(false)

    useEffect(()=>{
       if(active || error) {
           setConnecting(false)
       } 
    },[active,error])

    if (error) {
        return null
    }

    return (
        <Button
        isLoading={connecting}
        leftIcon={'walletconnect' as 'edit'}
        onClick= {():void => {
            setConnecting(true)

            if(walletconnect?.walletConnectProvider?.wc?.uri) {
                walletconnect.walletConnectProvider = undefined
            }

            activate(walletconnect,undefined,true).catch((error)=>{
                if(error instanceof UserRejectedRequestError) {
                    setConnecting(false)
                } else {
                    setError(error)
                }
            })
        }}
        >
            WalletConnect
        </Button>
    )
}