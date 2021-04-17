import { formatUnits } from "@ethersproject/units";

export const CHAIN_ID_NAMES: { [key: number]: string } = {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Görli',
    42: 'Kovan'
}

export const INFURA_PREFIXES: { [key: number]: string } = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan'
}

export const parseBalance = (balance:any, decimals = 18, decimalstoDisplay = 3) => Number(formatUnits(balance, decimals)).toFixed(decimalstoDisplay)

export enum DataType {
    BlockNumber,
    ETHBalance
}