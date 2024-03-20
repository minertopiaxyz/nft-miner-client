import React from 'react'

const client = require('../client.json');
const { tokenSymbol } = client;
const Lib = require('../Lib');
const { simpleNum, secsToText } = Lib;
// let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const VaultUI = (props) => {
  const {
    ts,
    amountToStake,
    onAmountToStake,
    amountToUnstake,
    onAmountToUnstake,
    onMaxStake,
    onMaxUnstake,
    userStakedToken,
    unclaimedReward,
    needApprove,
    onApprove,
    onStake,
    onUnstake,
    onWithdraw,
    onClaim,
    allowUnstakeTime,
    allowWithdrawTime,
    nextUpdateTime,
    userUnstakedToken,
    apy
  } = props;
  // const [ts, setTs] = useState(0);
  // const stakeMsg = 'Stake minted Fluxtopia Coin ($FTC) in Fluxtopia staking vault to earn more $FTC. Estimated annual yield (APY) calculated from 7 days average of daily yield.'

  let enableClaim = Number(unclaimedReward) > 0;
  let enableApprove = needApprove;
  let enableStake = !needApprove && !enableClaim;
  let enableUnstake = !enableClaim && (ts > allowUnstakeTime) && (Number(userStakedToken) > 0)
  let enableWithdraw = !enableClaim && (Number(userUnstakedToken) > 0) && (ts > allowWithdrawTime);

  const nowTs = ts;

  const secsUnstake = (allowUnstakeTime - nowTs) > 0 ? (allowUnstakeTime - nowTs) : 0;
  const secsUnstakeStr = secsToText(secsUnstake);
  const secsUnstakePctg = 100 - (secsUnstake * 100 / (3600 * 24));

  let inputUnstake = (
    <div className="flex-1 gap-2">
        <label className="flex input input-bordered items-center flex-1">
          <input value={amountToUnstake} onChange={e => onAmountToUnstake(e.target.value)}
            disabled={!enableUnstake}
            type="number" className='w-3/4 md:w-full grow' placeholder={"enter amount $" + tokenSymbol} />
          <button className="btn btn-ghost btn-sm" onClick={() => onMaxUnstake()}>MAX</button>
        </label>
    </div>
  );

  if (ts < allowUnstakeTime) inputUnstake = (
    <div className="flex-1">
      Unstake allowed in {secsUnstakeStr}<br />
      <progress className="progress w-full" value={secsUnstakePctg} max="100"></progress>
    </div>
  );


  let delta = (24 * 3600);
  if (nextUpdateTime > 0) {
    delta = nextUpdateTime - ts;
    if (delta < 0) delta = 0;
  }
  let pctgNextTime = 100 - (delta / (24 * 36));

  const secsWithdraw = (allowWithdrawTime - nowTs) > 0 ? (allowWithdrawTime - nowTs) : 0;
  const secsWithdrawStr = secsToText(secsWithdraw);
  const secsWithdrawPctg = 100 - (secsWithdraw * 100 / (3600 * 24));

  let panelWithdraw = null;
  if (Number(userUnstakedToken) > 0) {
    panelWithdraw = (
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          {userUnstakedToken} ${tokenSymbol} can be withdraw in {secsWithdrawStr}<br />
          <progress className="progress w-full" value={secsWithdrawPctg} max="100"></progress>
        </div>
        <button
          disabled={!enableWithdraw}
          onClick={() => onWithdraw()}
          className="btn md:w-40">Withdraw</button>
      </div>
    );
  }


  // useEffect(() => {
  //   const itv = setInterval(() => {
  //     setTs(ts);
  //   }, 1000);

  //   return () => {
  //     clearInterval(itv);
  //   }
  // }, []);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Staking Vault</h3>
      {/* <p className="mt-2">
        {stakeMsg}
      </p> */}

      <div className="stats w-full stats-vertical lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">est. APY</div>
          <div className="stat-value">{Number(apy) > 1000 ? '>1000' : simpleNum(apy)}%</div>
        </div>

        <div className="stat">
          <div className="stat-title">Staked ${tokenSymbol}</div>
          <div className="stat-value">{simpleNum(userStakedToken)}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Unclaimed Reward</div>
          <div className="stat-value">{simpleNum(unclaimedReward)}</div>
        </div>

        {/* <div className="stat">
          <div className="stat-title">Incoming Reward</div>
          <div className="stat-value">0</div>
        </div> */}

      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div>
          <label className="flex input input-bordered items-center flex-1">
            <input
              className='w-3/4 md:w-full grow'
              value={amountToStake} onChange={e => onAmountToStake(e.target.value)}
              type="number" placeholder={"enter amount $" + tokenSymbol} />
            <button className="btn btn-ghost btn-sm" onClick={() => onMaxStake()}>MAX</button>
          </label>
        </div>
        {/* <label className="flex input input-bordered items-center flex-1">
            <input
              className='w-3/4 md:w-full grow'
              value={amount} onChange={(e) => onAmountChange(e.target.value)}
              type="number" placeholder={"enter amount"} />
            <button onClick={() => onMaxValue()} className="btn btn-ghost btn-sm">MAX</button>
          </label>
        <input value={amountToStake} onChange={e => onAmountToStake(e.target.value)}
          type="number" placeholder={"enter amount $" + tokenSymbol} className="md:hidden input input-bordered input-sm w-full" />
        <button className="md:hidden btn btn-primary btn-sm" onClick={() => onMaxStake()}>MAX</button> */}
        <div className='grid grid-cols-2 gap-2'>
          <button disabled={!enableApprove}
            onClick={() => onApprove()}
            className="btn btn-primary md:w-40">Approve</button>
          <button
            disabled={!enableStake}
            onClick={() => onStake()}
            className="btn btn-primary md:w-40">Stake</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        {inputUnstake}
        <button
          disabled={!enableUnstake}
          onClick={() => onUnstake()}
          className="btn md:w-40">Unstake</button>
      </div>

      {panelWithdraw}

      <div className="flex flex-col md:flex-row md:justify-end gap-2">
        <div className="flex-1">
          Coin Mined in {secsToText(delta)}<br />
          <progress className="progress w-full" value={pctgNextTime} max="100"></progress>
        </div>
        <button
          disabled={!enableClaim}
          onClick={() => onClaim()}
          className="btn btn-primary md:w-40">Claim Reward</button>
      </div>

    </div>
  )
}

export default VaultUI
