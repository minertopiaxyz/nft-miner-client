import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DappContext } from '../Dashboard'
import ManageUI from './ManageUI'

const Lib = require('../Lib');

const Manage = () => {
  const ctx = useContext(DappContext);
  const dispatch = ctx.dappDispatch;
  const dappState = ctx.dappState;

  const [selectedNftId, setSelectedNftId] = useState(0);
  const [amountPowerUp, setAmountPowerUp] = useState('');

  useEffect(() => {
    // did mount here
  }, []);

  const connected = dappState && dappState.userAddress;

  const dapp = dappState.dapp;
  const ts = dappState.ts;
  const userData = dappState.userData;
  const userNftData = dappState.userNftData;

  let userETH = 0;
  let userToken = 0;
  let ownedNFT = 0;
  let nftIds = [];
  let basePower = 0;
  let extraPower = 0;
  let unclaimedReward = 0;
  let epPercentage = 0;
  let baseIncome = 0;
  let extraIncome = 0;
  let nextUpdateTime = 0;

  if (connected) {
    userETH = dapp.wei2eth(userData.userETH);
    userToken = dapp.wei2eth(userData.userToken);
    ownedNFT = userNftData.nftIds.length;
    nextUpdateTime = userNftData.nextUpdateTime;
    if (ownedNFT > 0) {
      nftIds = userNftData.nftIds;
      if (selectedNftId > 0) {
        const nftId2data = userNftData.nftId2data;
        const selectedNftData = nftId2data[selectedNftId].nftData;
        epPercentage = nftId2data[selectedNftId].percentage > 0 ? nftId2data[selectedNftId].percentage : 0;
        basePower = dapp.wei2eth(selectedNftData.basePower);
        extraPower = dapp.wei2eth(selectedNftData.extraPower);
        unclaimedReward = dapp.wei2eth(selectedNftData.unclaimedReward.reward);
        baseIncome = dapp.wei2eth(selectedNftData.unclaimedReward.rewardBP);
        extraIncome = dapp.wei2eth(selectedNftData.unclaimedReward.rewardEP);
      }
    }
  }

  const refreshData = async () => {
    try {
      const userData = await dapp.getUserData();
      const userNftData = await dapp.NFT.getUserNft();
      dispatch({ type: 'SET_USER_DATA', userData });
      dispatch({ type: 'SET_USER_NFT_DATA', userNftData });
    } catch (err) {
    }
  }

  const powerUp = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.NFT.powerUp(selectedNftId, amountPowerUp);
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

  const claimReward = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const nftId = selectedNftId;
      const tx = await dapp.NFT_REWARD.claimReward(nftId);
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

  // useEffectAsync(async () => {
  //   if (connected) {
  //     await refreshData();
  //   }
  // }, [connected]);

  return (
    <ManageUI
      ts={ts}
      userETH={userETH}
      userToken={userToken}
      nftIds={nftIds}
      selectedNftId={selectedNftId}
      onSelectNftId={(val) => setSelectedNftId(val)}
      amountPowerUp={amountPowerUp}
      onAmountPowerUp={(val) => setAmountPowerUp(val)}
      onMaxStake={() => setAmountPowerUp(userETH)}
      onPowerUp={() => powerUp()}
      onClaimReward={() => claimReward()}
      basePower={basePower}
      extraPower={extraPower}
      unclaimedReward={unclaimedReward}
      epPercentage={epPercentage}
      baseIncome={baseIncome}
      extraIncome={extraIncome}
      nextUpdateTime={nextUpdateTime}
    />
  )
}

export default Manage
