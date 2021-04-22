import { useWeb3React } from '@web3-react/core';
import useSWR, { SWRResponse } from 'swr';
import { Contract } from "@ethersproject/contracts"
import { useContract } from './useContract';
import SurveyFactory from "../contracts/SurveyFactory.json"
import { useKeepSWRDATALiveAsBlocksArrive } from './useKeepSWRDATALiveAsBlocksArrive';
import { DataType } from '../utils';

function getSurveys(contract: Contract): (address: any) => Promise<any> {
    return async (): Promise<any> => {
        return contract.surveys(0).then((result: any) => result)
    }
}

export function useSurveys(suspense = false): SWRResponse<any, any> {
    const { chainId } = useWeb3React();

    const contract = useContract(SurveyFactory?.address, SurveyFactory?.abi, true);

    const result = useSWR(SurveyFactory && contract ? [chainId, SurveyFactory.address] : null,
        getSurveys(contract as Contract), {
        suspense
    });
    useKeepSWRDATALiveAsBlocksArrive(result.mutate)

    return result;
}