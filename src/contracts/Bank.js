const ethers = require("ethers").ethers;
const SC_ABI = require('./json/BankV1.sol/BankV1.json').abi;

module.exports = class Bank {
  constructor(dapp) {
    this.dapp = dapp;
  }

  async init() {
    const signer = this.dapp.getSigner();
    this.sc = new ethers.Contract(this.dapp.config.bank, SC_ABI, signer);
    this.address = this.sc.address;
  }

  async swapCoinToToken(amount, receiver) {
    const userAddress = this.dapp.getUserAddress();
    if (!receiver) receiver = userAddress;
    const amountWei = this.dapp.eth2wei(amount);
    const opts = Object.assign({ value: amountWei }, this.dapp.OPTS);
    return await this.sc.swapCoinToToken(receiver, opts);
  }

  async swapTokenToCoin(amount, receiver) {
    const userAddress = this.dapp.getUserAddress();
    if (!receiver) receiver = userAddress;
    const amountWei = this.dapp.eth2wei(amount);
    const opts = Object.assign({}, this.dapp.OPTS);
    return await this.sc.swapTokenToCoin(amountWei, receiver, opts);
  }

  async simulateSwapCoinToToken(amount) {
    const wei2eth = this.dapp.wei2eth;
    const amountWei = this.dapp.eth2wei(amount);
    const num = await this.sc.coinToToken(amountWei);
    return wei2eth(num);
  }

  async simulateSwapTokenToCoin(amount) {
    const wei2eth = this.dapp.wei2eth;
    const amountWei = this.dapp.eth2wei(amount);
    const num = await this.sc.tokenToCoin(amountWei);
    return wei2eth(num);
  }

  async getPriceData() {
    const wei2eth = this.dapp.wei2eth;
    const eth2wei = this.dapp.eth2wei;
    const banksc = this.sc;

    const floorPrice = await banksc.tokenToCoin(eth2wei('1.0'));
    const a = await banksc.coinToToken(eth2wei('1.0'));
    const ceilPrice = eth2wei('1000000000000000000').div(a);
    const midPrice = (floorPrice.add(ceilPrice)).div('2');

    let ret = {
      ceilPrice: wei2eth(ceilPrice),
      midPrice: wei2eth(midPrice),
      floorPrice: wei2eth(floorPrice)
    }

    return ret;
  }

  async getUserData() {
    const needApprove = await this.dapp.needApprove(this.dapp.TOKEN.sc, this.address);

    let ret = {
      needApprove
    }

    return ret;
  }


  async cleanUp() {
  }

}
