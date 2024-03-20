import React from 'react'
import { useContext } from 'react'
import { DappContext } from '../Dashboard'
import MintUI from './MintUI'

const Lib = require('../Lib');
// const client = require('../client.json');
// const { nftImgUrl, placeholderImgUrl } = client;

const Mint = () => {
  const ctx = useContext(DappContext);
  const dispatch = ctx.dappDispatch;
  const dappState = ctx.dappState;

  const connected = dappState && dappState.userAddress;
  const dapp = dappState.dapp;
  const userData = dappState.userData;
  const uiData = dappState.uiData;

  const { nftImgUrl, placeholderImgUrl } = uiData;

  let userETH = 0;
  let nextNftId = 0;
  let nextNftImg = placeholderImgUrl;

  if (connected) {
    userETH = dapp.wei2eth(userData.userETH);
    nextNftId = dappState.userNftData.totalSupply + 1;
    nextNftImg = nftImgUrl + nextNftId;
  }

  const refreshData = async () => {
    try {
      const userData = await dapp.getUserData();
      const userNftData = await dapp.NFT.getUserNft();

      dispatch({ type: 'SET_USER_DATA', userData });
      dispatch({ type: 'SET_USER_NFT_DATA', userNftData });
    } catch (err) {
      console.error(err);
    }
  }

  const mintNFT = async () => {

    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.NFT.mint();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  return (
    <MintUI
      uiData={uiData}
      userETH={userETH}
      nextNftId={nextNftId} nextNftImg={nextNftImg}
      onMintNFT={() => mintNFT()} />
  )
}

export default Mint
