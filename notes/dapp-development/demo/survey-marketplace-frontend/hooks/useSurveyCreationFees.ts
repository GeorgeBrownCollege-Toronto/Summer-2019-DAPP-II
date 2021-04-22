import { useWeb3React } from '@web3-react/core';
import useSWR, { SWRResponse } from 'swr';
import { Contract } from "@ethersproject/contracts"
import { useContract } from './useContract';
import SurveyFactory from "../contracts/SurveyFactory.json"

function getSurveyCreationFees(contract: Contract): (address: string) => Promise<string> {
    return async (): Promise<string> => {
        return contract.surveyCreationFees().then((fee: string) => fee.toString())
    }
}

export function useSurveyCreationFees(suspense = false): SWRResponse<any, any> {
    const { chainId } = useWeb3React();

    const contract = useContract(SurveyFactory?.address, SurveyFactory?.abi, true);

    const result = useSWR(SurveyFactory && contract ? [chainId, SurveyFactory.address, "number"] : null,
        getSurveyCreationFees(contract as Contract), {
        suspense
    });
    return result;
}