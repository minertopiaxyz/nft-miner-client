const ethers = require("ethers").ethers;
const config = require('./json/config.json');
const SC_ABI = require('./json/GuardV1.sol/GuardV1.json').abi;
const SC_ADDRESS = config.guard;
const ROUTER_ABI = require('./json/uniswapv2router02abi.json');

module.exports = class Guard {
  constructor(dapp) {
    this.dapp = dapp;
  }

  async init() {
    const signer = this.dapp.getSigner();
    this.sc = new ethers.Contract(SC_ADDRESS, SC_ABI, signer);
    this.router = new ethers.Contract(config.router, ROUTER_ABI, signer);
    this.address = this.sc.address;
  }

  async approve() {
    const coin = this.dapp.USDT.sc;
    const needApprove = await this.dapp.needApprove(coin, this.address);
    if (needApprove) {
      const tx = await this.dapp.approve(coin, this.address);
      await tx.wait();
    }
  }

  async getSwapPrice() {
    return await this.swapToken2Coin('1.0');
  }

  async getData() {
    const wei2eth = this.dapp.wei2eth;
    const eth2wei = this.dapp.eth2wei;
    const banksc = this.dapp.BANK.sc;

    const floorPrice = await banksc.tokenToCoin(eth2wei('1.0'));
    const swapPrice = await this.swapToken2Coin('1.0');
    const a = await banksc.coinToToken(eth2wei('1.0'));
    const ceilPrice = eth2wei('1000000000000000000').div(a);

    let ret = {
      ceilPrice: wei2eth(ceilPrice),
      swapPrice: wei2eth(swapPrice),
      floorPrice: wei2eth(floorPrice),
      action: 'wait',
      sample: 0,
      profitPump: false,
      profitDump: false
    }

    if (swapPrice.lt(floorPrice) || swapPrice.gt(ceilPrice)) {
      const obj = await this.simulate();
      ret = Object.assign({}, ret, obj);
    }

    ret.mayGuard = ret.action === 'pump' || ret.action === 'dump';
    return ret;
  }

  async simulate() {
    const wei2eth = this.dapp.wei2eth;
    const eth2wei = this.dapp.eth2wei;
    const guardsc = this.sc;

    let test = Number(0.1);

    let sample = 0;
    let profitDump = false;
    let profitPump = false;

    for (let i = 1; i < 20; i++) {
      try {
        let newSample = eth2wei('' + ((test * i) + 0.4));
        let profit = await guardsc.callStatic.buyBankSellSwap(newSample);
        if (!profitDump || profit.gt(profitDump)) {
          sample = wei2eth(newSample);
          profitDump = profit;
          // console.log('best-sample: ' + sample + ' profit: ' + wei2eth(profit));
        } else break;
      } catch (err) {
        // console.error(err.message);
        console.error('callStatic.buyBankSellSwap error!');
        break;
      }
    }

    if (!profitDump) {
      for (let i = 1; i < 20; i++) {
        try {
          let newSample = eth2wei('' + (test * i));
          let profit = await guardsc.callStatic.buySwapSellBank(newSample);
          if (!profitPump || profit.gt(profitPump)) {
            sample = wei2eth(newSample);
            profitPump = profit;
            // console.log('best-sample: ' + sample + ' profit: ' + wei2eth(profit));
          } else break;
        } catch (err) {
          // console.error(err.message);
          console.error('callStatic.buySwapSellBank error!');
          break;
        }
      }
    }

    let action = 'wait';

    if (profitPump) {
      profitPump = wei2eth(profitPump);
      action = 'pump';
    }

    if (profitDump) {
      profitDump = wei2eth(profitDump);
      action = 'dump';
    }

    return { action, sample, profitPump, profitDump };
  }

  async simulateAndRun() {
    const s = await this.simulate();
    if (s.action === 'pump' || s.action === 'dump')
      return this.run(s.sample, s.profitPump, s.profitDump);
    throw new Error('simulation fail');
  }

  async run(sample, profitPump, profitDump) {
    let tx;
    const eth2wei = this.dapp.eth2wei;
    const guardsc = this.sc;

    if (profitDump) {
      tx = await guardsc.buyBankSellSwap(eth2wei(sample));
      return tx;
    } else if (profitPump) {
      tx = await guardsc.buySwapSellBank(eth2wei(sample));
      return tx;
    }
  }


  async swapToken2Coin(amountInToken) {
    const amountIn = ethers.utils.parseEther(amountInToken);
    let path = [
      config.token,
      config.coin
    ];
    let result = await this.router.getAmountsOut(amountIn, path);
    return result[1];
  }

  async cleanUp() {
  }

}
