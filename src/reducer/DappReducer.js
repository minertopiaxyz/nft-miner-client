export const dappInitialState = {
  ts: 0,
  dapp: null,
  userAddress: null,
  userData: null,
  userNftData: null,
  poolData: null,
  farmData: null,
  guardData: null,
  bankData: null,
  priceData: null,
  msg: '',

  txStatus: 'CLOSE', // 'BUSY', 'SUCCESS', 'ERROR', 'CLOSE'
  txHash: '',
  txError: '',
}

export const dappReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TS':
      return {
        ...state,
        ts: action.ts
      };
    case 'SET_DAPP':
      return {
        ...state,
        dapp: action.dapp,
        userAddress: action.dapp.getUserAddress(),
        userData: action.userData,
        userNftData: action.userNftData
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.userData
      };
    case 'SET_USER_NFT_DATA':
      return {
        ...state,
        userNftData: action.userNftData
      };
    case 'SET_POOL_DATA':
      return {
        ...state,
        poolData: action.poolData
      };
    case 'SET_FARM_DATA':
      return {
        ...state,
        farmData: action.farmData
      };
    case 'SET_GUARD_DATA':
      return {
        ...state,
        guardData: action.guardData
      };
    case 'SET_BANK_DATA':
      return {
        ...state,
        bankData: action.bankData
      };
    case 'SET_PRICE_DATA':
      return {
        ...state,
        priceData: action.priceData
      };
    case 'TX_SHOW':
      return {
        ...state,
        txStatus: 'BUSY',
        txHash: '',
        txError: '',
      };
    case 'TX_SET_HASH':
      return {
        ...state,
        txHash: action.txHash
      };
    case 'TX_SUCCESS':
      return {
        ...state,
        txStatus: 'SUCCESS'
      };
    case 'TX_ERROR':
      return {
        ...state,
        txStatus: 'ERROR',
        txError: action.txError,
      };
    case 'TX_CLOSE':
      return {
        ...state,
        txStatus: 'CLOSE',
        txHash: '',
        txError: '',
      };

    case 'SET_MSG':
      return {
        ...state,
        msg: action.msg
      };
    default:
      return state;
  }
};



