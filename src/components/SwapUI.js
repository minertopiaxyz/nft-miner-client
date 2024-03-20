import React from 'react'
import { MdOutlineSwapCalls } from "react-icons/md";

const SwapUI = ({
  uiData,
  needApprove,
  userETH,
  userToken,
  price,
  mode,
  amount,
  amountResult,
  onAmountChange,
  onSwap,
  onMaxValue,
  onSwitchBuySell,
  onApprove
}) => {
  const { ethSymbol, tokenSymbol } = uiData;
  let topSymbol;
  let bottomSymbol;
  let btns;

  if (mode === 'buy') {
    topSymbol = ethSymbol;
    bottomSymbol = tokenSymbol;
    let okToSwap = (Number(amount) > 0 && Number(amount) <= Number(userETH));
    btns = (
      <div className='grid grid-cols-1 gap-2'>
        <button className="btn btn-primary"
          disabled={!okToSwap}
          onClick={() => onSwap()}>Swap</button>
      </div>
    );
  } else if (mode === 'sell') {
    topSymbol = tokenSymbol;
    bottomSymbol = ethSymbol;

    let okToSwap = !needApprove && (Number(amount) > 0 && Number(amount) <= Number(userToken));
    let okToApprove = needApprove;

    btns = (
      <div className='grid grid-cols-2 gap-2'>
        <button className="btn btn-primary"
          disabled={!okToApprove}
          onClick={() => onApprove()}>Approve</button>

        <button className="btn btn-primary"
          disabled={!okToSwap}
          onClick={() => onSwap()}>Swap</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Swap</h3>
      <p>Price of 1 ${tokenSymbol}: {price} ${ethSymbol}</p>
      <div className="flex flex-1 flex-col gap-2">
        <div className='flex flex-row items-center'>
          <label className="flex input input-bordered items-center flex-1">
            <input
              className='w-3/4 md:w-full grow'
              value={amount} onChange={(e) => onAmountChange(e.target.value)}
              type="number" placeholder={"enter amount"} />
            <button onClick={() => onMaxValue()} className="btn btn-ghost btn-sm">MAX</button>
          </label>
          <div className='text-right w-14'>${topSymbol}</div>
        </div>
        <div className='flex text-center items-center justify-center'>
          <button
            onClick={() => onSwitchBuySell()}
            className='btn btn-outline btn-sm'><MdOutlineSwapCalls size={20} /></button>
        </div>
        <div className='flex flex-row items-center'>
          <label className="flex input input-bordered items-center flex-1">
            <div className='w-3/4 md:w-full'>{amountResult}</div>
          </label>
          <div className='text-right w-14'>${bottomSymbol}</div>
        </div>

        {btns}

      </div>

    </div>

  )
}

export default SwapUI
