import { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import { Button, Box } from "@chakra-ui/core";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useQueryParameters } from "../hooks/useQueryParamters";
import { QueryParameters } from "../constants";
import { getNetwork, injected } from "../connectors";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useETHBalance } from "../hooks/useETHBalance";
import { TokenAmount } from "@uniswap/sdk";

function ETHBalance(): JSX.Element {
    const { account } = useWeb3React();
    const { data } = useETHBalance(account, true);

    return (
        <div>
            <p>Account address : {account}</p>
            <p>Balance : {(data as TokenAmount).toSignificant(4, { groupSeparator: ',' })} ETH</p>
        </div>
    );
}

export default function Account({
    triedToEagerConnect,
}: {
    triedToEagerConnect: boolean;
}): JSX.Element | null {
    const {
        active,
        error,
        activate,
        library,
        chainId,
        account,
        setError,
    } = useWeb3React<Web3Provider>();

    // initialize metamask onboarding
    const onboarding = useRef<MetaMaskOnboarding>();

    // useLayoutEffect(() => {
    //     onboarding.current = new MetaMaskOnboarding();
    // }, [])

    // automatically try connecting network connector where applicable
    const queryParameters = useQueryParameters();
    const requiredChainID = queryParameters[QueryParameters.CHAIN];

    useEffect(() => {
        if (triedToEagerConnect && !active && !error) {
            activate(getNetwork(requiredChainID));
        }
    }, [triedToEagerConnect, active, error, requiredChainID, activate]);

    // manage connecting state for injected connector
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        if (active || error) {
            setConnecting(false);
            onboarding.current?.stopOnboarding();
        }
    }, [active, error]);

    if (error) {
        return null;
    } else if (!triedToEagerConnect) {
        return null;
    } else if (typeof account !== "string") {
        return (
            <Box>
                {MetaMaskOnboarding.isMetaMaskInstalled() ||
                    (window as any)?.ethereum ||
                    (window as any)?.web3 ? (
                    <Button
                        isLoading={connecting}
                        leftIcon={
                            MetaMaskOnboarding.isMetaMaskInstalled()
                                ? ("metamask" as "edit")
                                : undefined
                        }
                        onClick={(): void => {
                            setConnecting(true);
                            activate(injected, undefined, true).catch((error) => {
                                if (error instanceof UserRejectedRequestError) {
                                    setConnecting(false);
                                } else {
                                    setError(error);
                                }
                            });
                        }}
                    >
                        {MetaMaskOnboarding.isMetaMaskInstalled()
                            ? "Connect to MetaMask"
                            : "Connect to Wallet"}
                    </Button>
                ) : (
                    <Button
                        leftIcon={"metamask" as "edit"}
                        onClick={() => onboarding.current?.startOnboarding()}
                    >
                        Install Metamask
                    </Button>
                )}
            </Box>
        );
    }

    return (
        <Suspense
            fallback={
                <Button
                    variant="outline"
                    isLoading
                    cursor="default !important"
                    _hover={{}}
                    _active={{}}
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
                >
                    {null}
                </Button>
            }
        >
            <ETHBalance />
        </Suspense>
    );
}
