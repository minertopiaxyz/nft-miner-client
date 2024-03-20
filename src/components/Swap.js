import React, { useState, useContext, useEffect } from 'react'
import SwapUI from './SwapUI';
import { DappContext } from '../Dashboard';

const Lib = require('../Lib');

const Swap = () => {
  const ctx = useContext(DappContext);
  const dispatch = ctx.dappDispatch;
  const dappState = ctx.dappState;

  const [amount, setAmount] = useState('');
  const [amountResult, setAmountResult] = useState('');
  const [mode, setMode] = useState('buy');

  const connected = dappState && dappState.userAddress;
  const dapp = dappState.dapp;
  const userData = dappState.userData;
  const bankData = dappState.bankData;
  const priceData = dappState.priceData;
  const uiData = dappState.uiData;

  let userETH = 0;
  let userToken = 0;
  let needApprove = false;
  let price = '';

  if (connected) {
    userETH = dapp.wei2eth(userData.userETH);
    userToken = dapp.wei2eth(userData.userToken);

    if (bankData) {
      needApprove = bankData.needApprove;
    }

    if (priceData) {
      price = priceData.midPrice;
    }
  }

  const onAmountChange = async (val) => {
    setAmount(val);
  };

  const refreshData = async () => {
    try {
      const userData = await dapp.getUserData();
      dispatch({ type: 'SET_USER_DATA', userData });
      const bankData = await this.getUserData();
      dispatch({ type: 'SET_BANK_DATA', bankData });
    } catch (err) {
    }
  }

  const onApprove = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const spenderAddress = dapp.BANK.address;
      const tx = await dapp.approve(dapp.TOKEN, spenderAddress)
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

  const onSwap = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      let tx;
      if (mode === 'buy') {
        tx = await dapp.BANK.swapCoinToToken(amount);
      } else {
        tx = await dapp.BANK.swapTokenToCoin(amount);
      }
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  };

  const onMaxValue = () => {
    if (mode === 'buy') setAmount(userETH + '');
    else setAmount(userToken + '');
  };

  const onSwitchBuySell = () => {
    // const oldVal = amountResult;
    if (mode === 'buy') {
      setMode('sell');
      setAmount('');
    }
    else {
      setMode('buy');
      setAmount('');
    }
  };

  const bank = dapp?.BANK;

  useEffect(() => {
    const getCounterPrice = async (val) => {
      if (Number(val) > 0) {
        let result;
        if (mode === 'buy')
          result = await bank.simulateSwapCoinToToken(val);
        else
          result = await bank.simulateSwapTokenToCoin(val);
        setAmountResult(result);
      } else {
        setAmountResult('');
      }
    }
    getCounterPrice(amount);
  }, [amount, mode, bank]);

  return (
    <SwapUI
      uiData={uiData}
      needApprove={needApprove}
      userETH={userETH}
      userToken={userToken}
      price={price}
      mode={mode}
      amount={amount}
      amountResult={amountResult}
      onAmountChange={(val) => onAmountChange(val)}
      onSwap={() => onSwap()}
      onMaxValue={() => onMaxValue()}
      onSwitchBuySell={() => onSwitchBuySell()}
      onApprove={() => onApprove()}
    />
  )
}

export default Swap
