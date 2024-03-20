import { createContext, useEffect, useState } from "react";
import { useReducer } from "react";
import { dappReducer, dappInitialState } from './reducer/DappReducer';
import moment from 'moment';
import Mint from "./components/Mint";
import Manage from "./components/Manage";
import Vault from "./components/Vault";
import Wallet from "./components/Wallet";
import PopupTx from "./components/PopupTx";
import Swap from './components/Swap';

const client = require('./client.json');
const client3636 = require('./client3636.json');
const client7701 = require('./client7701.json');

const Lib = require('./Lib');
const Dapp = require("./contracts/Dapp");
// const { clearStorageValue } = Lib;

export const DappContext = createContext();

function Dashboard() {
  const [dappState, dappDispatch] = useReducer(dappReducer, dappInitialState);
  const [selTab, setSelTab] = useState(0);

  const { blockchainName, metamaskUrl, chainlistUrl } = dappState.uiData;

  useEffect(() => {
    let DAPP = new Dapp();
    let itv;
    let offset = 0;

    const initTS = async () => {
      try {
        const ts = await DAPP.getBlockTS();
        offset = ts - moment().unix(); // ts = moment().unix() + offset
        dappDispatch({ type: 'SET_TS', ts: ts });        
      } catch (err) {
      }
    }

    const updateTS = async () => {
      try {
        dappDispatch({ type: 'SET_TS', ts: moment().unix() + offset });
      } catch (err) {
      }
    }

    const initDapp = async () => {
      const detectedChainId = await DAPP.getChainId();

      const CHAIN_ID = detectedChainId;

      let PROVIDER_URL;
      if (CHAIN_ID === 3636) {
        dappDispatch({ type: 'SET_UI_DATA', uiData: client3636 });
        PROVIDER_URL = 'https://node.botanixlabs.dev';
      } else if (CHAIN_ID === 7701) {
        dappDispatch({ type: 'SET_UI_DATA', uiData: client7701 });
        PROVIDER_URL = 'https://canto-testnet.plexnode.wtf';
      } else {
        dappDispatch({ type: 'SET_UI_DATA', uiData: client });
        PROVIDER_URL = 'http://127.0.0.1:8545';
      }

      DAPP.setChainId(CHAIN_ID);
      let walletOK = false;
      try {
        await DAPP.detectMetamask();
        await DAPP.loadMetamask();
        walletOK = true;
      } catch (err) {
        // console.error(err);
        console.error('** fail to load metamask **');
      }

      try {
        if (!walletOK) await DAPP.loadPrivateKey(null, PROVIDER_URL);
        await DAPP.initContracts();
        const userData = await DAPP.getUserData();
        const userNftData = await DAPP.NFT.getUserNft();
        const farmData = await DAPP.VAULT.getUserData();
        const bankData = await DAPP.BANK.getUserData();

        dappDispatch({ type: 'SET_DAPP', dapp: DAPP, userData, userNftData });
        dappDispatch({ type: 'SET_FARM_DATA', farmData });
        dappDispatch({ type: 'SET_BANK_DATA', bankData });

        await initTS();
        let busy = false;
        itv = setInterval(async () => {
          if (!busy) {
            busy = true;
            await updateTS();
            busy = false;
          }
        }, 1000);

      } catch (err) {
        console.error(err);
        console.error('** fail to initialize contract **');
      }
    }

    const cleanUpDapp = async () => {
      await DAPP.cleanUp();
      if (itv) clearInterval(itv);
    }

    // const qp = window.location.href;
    // if (qp.indexOf('mint') >= 0) setSelTab(0);
    // else if (qp.indexOf('manage') >= 0) setSelTab(1);
    // else if (qp.indexOf('swap') >= 0) setSelTab(3);
    // else if (qp.indexOf('vault') >= 0) setSelTab(4);

    initDapp();
    return () => {
      cleanUpDapp();
    }

  }, []);

  const header = (
    <Wallet />
    // <div />
  );

  const content1 = (
    <Mint />
    // <div />
  );

  const content2 = (
    <Manage />
    // <div />
  );

  const content3 = (
    <Swap />
    // <div />
  );

  const content4 = (
    <Vault />
    // <div />
  );

  const popupMetamask = (
    <dialog id="modal_metamask" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-xl text-center">Connect to {blockchainName}</h3>
        <div className="flex flex-col gap-2 mt-4">
          <button className="btn" onClick={() => Lib.openUrl(metamaskUrl)}>Install Metamask</button>
          <button className="btn" onClick={() => Lib.openUrl(chainlistUrl)}>Setup Metamask To {blockchainName}</button>
          <button className="btn" onClick={() => Lib.refreshPage()}>Refresh Page</button>
        </div>
      </div>
    </dialog>
  );

  return (
    <DappContext.Provider value={{ dappState, dappDispatch }}>
      <div className="h-screen bg-base-100 md:bg-base-200 flex justify-center md:pt-16 md:px-4">


        <div className="card md:shadow-xl w-full h-fit max-w-[768px] min-w-[360px] bg-base-100 rounded-none md:rounded-xl">
          <div className="card-body">
            {header}
            <div role="tablist" className="tabs tabs-lifted">
              <input type="radio"
                checked={selTab === 0}
                onChange={e => setSelTab(0)}
                role="tab" className="tab" aria-label="Mint" />
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-2 md:p-4">
                {content1}
              </div>

              <input type="radio"
                checked={selTab === 1}
                onChange={e => setSelTab(1)}
                role="tab" className="tab" aria-label="Manage" />
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-2 md:p-4">
                {content2}
              </div>

              <input type="radio"
                checked={selTab === 2}
                onChange={e => setSelTab(2)}
                role="tab" className="tab" aria-label="Swap" />
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-2 md:p-4">
                {content3}
              </div>

              <input type="radio"
                checked={selTab === 3}
                onChange={e => setSelTab(3)}
                role="tab" className="tab" aria-label="Vault" />
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-2 md:p-4">
                {content4}
              </div>
            </div>
          </div>
        </div>


      </div>
      {popupMetamask}
      <PopupTx />
    </DappContext.Provider>
  );
}

export default Dashboard;
