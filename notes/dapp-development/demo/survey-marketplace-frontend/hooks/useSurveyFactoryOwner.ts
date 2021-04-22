import { useWeb3React } from '@web3-react/core';
import useSWR, { SWRResponse } from 'swr';
import { Contract } from "@ethersproject/contracts"
import { DataType } from '../utils';
import { useContract } from './useContract';
import SurveyFactory from "../contracts/SurveyFactory.json"

function getSurveyFactoryOwner(contract: Contract): (address: string) => Promise<string> {
    return async (): Promise<string> => {
        return contract.owner().then((owner: string) => owner.toString())
    }
}

export function useSurveyFactoryOwner(suspense = false): SWRResponse<any, any> {
    const { chainId } = useWeb3React();

    const contract = useContract(SurveyFactory?.address, SurveyFactory?.abi, true);

    const result = useSWR(SurveyFactory && contract ? [chainId, SurveyFactory.address, DataType.Address] : null,
        getSurveyFactoryOwner(contract as Contract), {
        suspense
    });

    return result;

}