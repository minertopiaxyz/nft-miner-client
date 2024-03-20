import React from 'react'
import { useContext, useEffect } from 'react'
import { DappContext } from '../Dashboard'
import WalletUI from './WalletUI'

const Dapp = require('../contracts/Dapp');
const Lib = require('../Lib');
const client = require('../client.json');
const { CHAIN_ID } = client;

const Wallet = () => {
  const { dappState } = useContext(DappContext);

  useEffect(() => {
    // did mount here
  }, []);

  const connected = dappState && dappState.userAddress;
  const dapp = dappState.dapp;
  const userData = dappState.userData;

  let userETH = 0;
  let userToken = 0;
  let walletConnected = false;
  let userAddress = '';

  if (connected) {
    userETH = dapp.wei2eth(userData.userETH);
    userToken = dapp.wei2eth(userData.userToken);
    userAddress = userData.userAddress;
    if (!(dapp.isReadOnly())) walletConnected = true;
  }

  const connectWallet = async () => {

    try {
      const DAPP = new Dapp(CHAIN_ID);
      await DAPP.detectMetamask();
      await DAPP.loadMetamask();
      Lib.refreshPage();
    } catch (err) {
      console.error(err);
    }
    Lib.openPopupMetamask();
  }

  return (
    <WalletUI
      data={{ userETH, userToken, userAddress }}
      walletConnected={walletConnected}
      onConnectWallet={() => connectWallet()}
    />
  )
}

export default Wallet
