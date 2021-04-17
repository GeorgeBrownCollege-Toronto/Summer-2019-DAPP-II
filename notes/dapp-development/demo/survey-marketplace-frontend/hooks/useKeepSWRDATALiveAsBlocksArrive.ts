import { useEffect, useRef } from 'react';
import { SWRResponse } from 'swr';
import { useBlockNumber } from './useBlocknumber';


export function useKeepSWRDATALiveAsBlocksArrive(mutate: SWRResponse<any,any>['mutate']):void {
    const mutateRef = useRef(mutate)
    useEffect(()=>{
        mutateRef.current = mutate
    })

    // then, whenever a new block arrives, trigger a mutation
    const {data} = useBlockNumber();
    useEffect(() => {
        mutateRef.current()
    },[data])
}