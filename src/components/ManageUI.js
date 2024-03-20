import React from 'react'

const client = require('../client.json');
const { nftName, nftImgUrl, placeholderImgUrl, ethSymbol, tokenSymbol } = client;
const Lib = require('../Lib');
const { simpleNum, secsToText } = Lib;

const ManageUI = ({
  ts,
  userETH,
  nftIds,
  selectedNftId,
  onSelectNftId,
  amountPowerUp,
  onAmountPowerUp,
  onMaxStake,
  onPowerUp,
  basePower,
  extraPower,
  unclaimedReward,
  epPercentage,
  baseIncome,
  extraIncome,
  nextUpdateTime,
  onClaimReward
}) => {
  // const [ts, setTs] = useState(0);
  // const manageMsg = 'Every Fluxtopia People is a miner of Fluxtopia Coin $FTC. Receive equal share of 30% mined coin as basic income. Invest more $CFX to get share in remaining 70% mined coin. Invested $CFX will be staked in PoS pool forever and the interest used to buyback $FTC.';

  const imgUrl = selectedNftId > 0 ? nftImgUrl + selectedNftId : placeholderImgUrl;
  const okToPowerUp = Number(amountPowerUp) > 0 && Number(amountPowerUp) <= Number(userETH) &&
    selectedNftId > 0 && (Number(unclaimedReward) === 0);

  let delta = (24 * 3600);
  if (nextUpdateTime > 0) {
    delta = nextUpdateTime - ts;
    if (delta < 0) delta = 0;
  }
  let pctgNextTime = 100 - (delta / (24 * 36));


  // useEffect(() => {
  //   const itv = setInterval(() => {
  //     setTs(moment().unix());
  //   }, 1000);

  //   return () => {
  //     clearInterval(itv);
  //   }
  // }, []);

  const btnClaimOk = Number(unclaimedReward) > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col-reverse md:flex-row gap-2">
        <div className="flex-1">
          <h3>
            <select className="text-lg font-bold select select-bordered w-full" onChange={e => onSelectNftId(e.target.value)}>
              <option disabled selected={selectedNftId === 0}>Select owned NFT!</option>
              {nftIds.map((item, index) => {
                const name = nftName + ' #' + (item + '').padStart(4, '0');
                return (
                  <option key={item} value={item}>{name}</option>
                );
              })}
            </select>
          </h3>

          {/* <p className="mt-2">{manageMsg}</p> */}

          <div className="grid w-full grid-cols-1 lg:grid-cols-3">
            <div className="stat">
              <div className="stat-title">Basic Income ${tokenSymbol}</div>
              <div className="stat-value">{simpleNum(baseIncome)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Revenue ${tokenSymbol}</div>
              <div className="stat-value">{simpleNum(extraIncome)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Unclaimed ${tokenSymbol}</div>
              <div className="stat-value">{simpleNum(unclaimedReward)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Contribution ${ethSymbol}</div>
              <div className="stat-value">{extraPower}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Participation</div>
              <div className="stat-value">{simpleNum(epPercentage)}%</div>
            </div>

          </div>
        </div>
        <div className="flex-none w-full aspect-square md:w-[200px] md:h-[200px]">
          <img className="object-fill rounded-box w-full md:mt-[-25px]" src={imgUrl} alt={nftName} />
        </div>
      </div>

      {/* <div className="stats w-full stats-vertical lg:stats-horizontal"> */}


      <div className="flex flex-col md:flex-row justify-end">
        <div className="md:mr-2 flex-1">
          Coin Mined in {secsToText(delta)}<br />
          <progress className="progress w-full" value={pctgNextTime} max="100"></progress>
        </div>
        <button onClick={() => onClaimReward()}
          disabled={!btnClaimOk} className='btn md:w-40 btn-primary'>Claim</button>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className='flex flex-row items-center flex-1'>
          <label className="flex input input-bordered items-center flex-1">
            <input
              className='w-3/4 md:w-full grow'
              value={amountPowerUp} onChange={(e) => onAmountPowerUp(e.target.value)}
              type="number" placeholder={"enter amount $" + ethSymbol} />
            <button onClick={() => onMaxStake()} className="btn btn-ghost btn-sm">MAX</button>

          </label>
        </div>

        <button className="btn btn-primary md:w-40"
          disabled={!okToPowerUp}
          onClick={() => onPowerUp()}>Contribute</button>

      </div>

    </div>

  )
}

export default ManageUI
