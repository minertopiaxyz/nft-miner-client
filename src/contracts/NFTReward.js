const ethers = require("ethers").ethers;
const SC_ABI = require('./json/NFTRewardV1.sol/NFTRewardV1.json').abi;

module.exports = class NFTReward {
  constructor(dapp) {
    this.dapp = dapp;
  }

  async init() {
    const signer = this.dapp.getSigner();
    this.sc = new ethers.Contract(this.dapp.config.nftreward, SC_ABI, signer);
    this.address = this.sc.address;
  }

  async claimReward(nftId) {
    const opts = Object.assign({}, this.dapp.OPTS);
    const tx = await this.sc.claimReward(nftId, opts);
    return tx;
  }

  async getUnclaimedReward(nftId) {
    const ret = await this.sc.getUnclaimedReward(nftId);
    return {
      reward: ret[0],
      rewardBP: ret[1],
      rewardEP: ret[2]
    };
  }

  async cleanUp() {
  }

}
