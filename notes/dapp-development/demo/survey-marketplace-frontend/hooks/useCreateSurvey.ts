import { Contract } from "@ethersproject/contracts"
import { useContract } from './useContract';
import SurveyFactory from "../contracts/SurveyFactory.json"

export function useCreateSurvey(suspense = false): any {
    const contract = useContract(SurveyFactory?.address, SurveyFactory?.abi, true);

    return async () => {
        return (contract as Contract).createSurvey({value:"1000000000000000010", gasLimit:"3000000"});
    } 
}
