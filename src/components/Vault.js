import React, { useState } from 'react'
import { useContext } from 'react'
import { DappContext } from '../Dashboard'
import VaultUI from './VaultUI'

const Lib = require('../Lib');

const Vault = () => {
  const ctx = useContext(DappContext);
  const dispatch = ctx.dappDispatch;
  const dappState = ctx.dappState;

  const [amountToStake, setAmountToStake] = useState('');
  const [amountToUnstake, setAmountToUnstake] = useState('');

  const connected = dappState && dappState.userAddress;
  const dapp = dappState.dapp;
  const ts = dappState.ts;
  const uiData = dappState.uiData;

  let userToken = 0;
  let needApprove = true;
  let userStakedToken = 0;
  let userUnstakedToken = 0;
  let unclaimedReward = 0;
  let allowUnstakeTime = 0;
  let allowWithdrawTime = 0;
  let nextUpdateTime = 0;
  let apy = 0;

  if (connected) {
    const userData = dappState.userData;
    userToken = dapp.wei2eth(userData.userToken);
    const farmData = dappState.farmData;
    if (farmData) {
      needApprove = farmData.needApprove;
      userStakedToken = dapp.wei2eth(farmData.stake);
      allowUnstakeTime = farmData.allowUnstakeTime;
      userUnstakedToken = dapp.wei2eth(farmData.pendingWithdraw);
      allowWithdrawTime = farmData.allowWithdrawTime;
      unclaimedReward = dapp.wei2eth(farmData.unclaimedReward);
      nextUpdateTime = userData.nextUpdateTime;
      apy = farmData.apy;
    }
  }

  const setStakeMax = () => {
    setAmountToStake(userToken);
  }

  const setUnstakeMax = () => {
    setAmountToUnstake(userStakedToken);
  }

  const refreshData = async () => {
    try {
      const userData = await dapp.getUserData();
      const farmData = await dapp.VAULT.getUserData();
      dispatch({ type: 'SET_USER_DATA', userData });
      dispatch({ type: 'SET_FARM_DATA', farmData });
    } catch (err) {
      console.error(err);
    }
  }

  const approve = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const vaultAddress = dapp.VAULT.address;
      const tx = await dapp.approve(dapp.TOKEN, vaultAddress)
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

  const stake = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.VAULT.stakeToken(amountToStake);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }

    await refreshData();
  }

  const unstake = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.VAULT.unstakeToken(amountToUnstake);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }

    await refreshData();
  }

  const withdraw = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.VAULT.withdrawToken();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }

    await refreshData();
  }

  const claimReward = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.VAULT.claimReward();
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
    <VaultUI
      uiData={uiData}
      ts={ts}
      amountToStake={amountToStake}
      onAmountToStake={val => setAmountToStake(val)}
      amountToUnstake={amountToUnstake}
      onAmountToUnstake={val => setAmountToUnstake(val)}
      onMaxStake={() => setStakeMax()}
      onMaxUnstake={() => setUnstakeMax()}
      userStakedToken={userStakedToken}
      unclaimedReward={unclaimedReward}
      needApprove={needApprove}
      onApprove={() => approve()}
      onStake={() => stake()}
      onUnstake={() => unstake()}
      onWithdraw={() => withdraw()}
      onClaim={() => claimReward()}
      allowUnstakeTime={allowUnstakeTime}
      allowWithdrawTime={allowWithdrawTime}
      nextUpdateTime={nextUpdateTime}
      userUnstakedToken={userUnstakedToken}
      apy={apy}

    />
  )
}

export default Vault
