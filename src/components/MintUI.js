import React from 'react'

const client = require('../client.json');
const { nftName, ethSymbol, mintCost, nftMaxSupply } = client;

const MintUI = ({ userETH, onMintNFT, nextNftId, nextNftImg }) => {
  const title = nftName + ' #' + (nextNftId + '').padStart(4, '0');

  // const mintMsg = `Become a new Fluxtopia People by minting the NFT for 100 $CFX. 
  // The $CFX will be staked into Conflux PoS pool and the interest will be used to buy back Fluxtopia Coin $FTC.`;

  const btnOK = Number(userETH) >= Number(mintCost);

  return (
    <div className="flex gap-2 flex-col md:flex-row">
      <div className="flex-initial">
        <img className="object-cover w-full aspect-square md:w-[400px] md:h-[400px] rounded-box md:mt-[-50px]"
          alt="title"
          src={nextNftImg} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2">
          Max. supply: {nftMaxSupply}<br />
          Minting cost: {mintCost} ${ethSymbol}
        </p>
        <span className="flex flex-row space-x-2 mt-2">
          <button
            disabled={!btnOK}
            className="btn btn-primary md:w-40" onClick={() => onMintNFT()}>Mint NFT</button>
        </span>
      </div>
    </div>
  )
}

export default MintUI
