require('dotenv').config();
const Dapp = require("./src/contracts/Dapp.js");

const MODE = process.env.MODE;
let PK = process.env.PRIVATEKEY_MAINNET;
if (MODE === 'FORK') PK = process.env.PRIVATEKEY_DUMMY;

let CHAIN_ID = process.env.CHAIN_ID;
CHAIN_ID = Number(CHAIN_ID);
let PROVIDER_URL = process.env.PROVIDER_URL;
if (MODE === 'FORK') PROVIDER_URL = 'http://127.0.0.1:8545';


let dapp = new Dapp(CHAIN_ID);
dapp.setChainId(CHAIN_ID);

async function run() {
  console.log('run..');
  try {
    await dapp.loadPrivateKey(PK, PROVIDER_URL);
    await dapp.initContracts();
    console.log('dapp ready..');

  } catch (err) {
    console.log('err msg:', err.message);
  }

  loop();
  setInterval(() => {
    loop();
  }, 30000);
}

let busy = false;
async function loop() {
  if (busy) return;
  busy = true;
  await dapp.updateByBot();
  busy = false;
}

run();