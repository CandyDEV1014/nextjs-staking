import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getLP_Token, getGamersePool, getLFG_Token } from './ethereum.js';

function App() {
  const [lp_token, setLpToken] = useState(0);
  const [lfg_token, setLFGToken] = useState(undefined);
  const [allowance, setAllowance] = useState(undefined);


  const [gamersePool, setGamersePool] = useState(undefined);

  const [data, setData] = useState(undefined);
  const [balance, setBalance] = useState(0);


  useEffect(() => {
    const init = async () => {
      const { lp_token } = await getLP_Token();
      const { gamersePool } = await getGamersePool()
      const { lfg_token } = await getLFG_Token()

      // const data = await lp_token.readData();
      setLpToken(lp_token);
      setGamersePool(gamersePool)
      setLFGToken(lfg_token)
      // setData(data);
    };
    init();
  }, []);

  const updateData = async e => {
    e.preventDefault();
    // const data = e.target.elements[0].value;
    // const tx = await lp_token.updateData(data);
    // await tx.wait();
    // const newData = await lp_token.readData();
    // setData(newData);
  };
  const getBalance = async () => {
    const signerAddress = await lp_token.signer.getAddress()
    const signerBalance = await lp_token.signer.getBalance()
    console.log('balance', signerBalance)
    console.log(ethers.utils.formatEther(signerBalance))
    const tx = await lp_token.balanceOf(signerAddress)
    // console.log(tx)
    console.log(ethers.utils.formatEther(tx))
    setBalance(ethers.utils.formatEther(tx))
  }
  const checkAllowance = async () => {
    const tx = await lp_token.allowance(await lp_token.signer.getAddress(), "0x54e0216116dd025c601EcC352Be3c0C888f7fc39")
    // if (tx > inputAmount){
    //   return true
    // } else {
    //   return false
    // }
    // console.log(checkallow)
    setAllowance(ethers.utils.formatEther(tx))
  }

  const getApprove = async () => {
    const tx = await lp_token.approve("0x54e0216116dd025c601EcC352Be3c0C888f7fc39", 20)
    tx.wait()
    console.log(tx)
  }
  const handleDeposit = async () => {
    const tx = await gamersePool.deposit(20)
    await tx.wait()
    console.log(tx)
  }
  const handleWithdraw = async () => {
    const max_panalty = await gamersePool.MAXIMUM_PENALTY_DURATION()
    console.log("max_panalty", ethers.utils.formatEther(max_panalty))
    const max_fee = await gamersePool.MAXIMUM_PENALTY_FEE()
    console.log("max_fee", ethers.utils.formatEther(max_fee))
    const MAXIMUM_WITHDRAWAL_INTERVAL = await gamersePool.MAXIMUM_WITHDRAWAL_INTERVAL()
    console.log("MAXIMUM_WITHDRAWAL_INTERVAL", ethers.utils.formatEther(MAXIMUM_WITHDRAWAL_INTERVAL))
    const owner = await gamersePool.owner()
    console.log("owner", owner)
    const canWithdraw = await gamersePool.canWithdraw(await lp_token.signer.getAddress())
    console.log("canWithdraw", canWithdraw)
    const userInfo = await gamersePool.userInfo(await lp_token.signer.getAddress())
    userInfo.map((hex,i)=>{
      console.log("userInfo",i, ethers.utils.formatEther(hex))
    })
    console.log("userInfo", userInfo)
    // const withdraw = await gamersePool.withdraw(20)
    // await withdraw.wait()
    // console.log("withdraw", withdraw)

  }
  // approve(spender: <gamersePool contract address>, amount: <amount user's going to deposit or set maximum value on frontend>)
  // After allowance is fine, call deposit function in GamersePool contract: deposit(amount: <user amount gonna deposit>)
  // Call withdraw function in GamersePool contract: withdraw(amount: <user amount going to withdraw>)
  // if(
  //   typeof lp_token === 'undefined'
  //   || typeof data === 'undefined'
  // ) {
  //   return 'Loading...';
  // }
  console.log("LP_TOKEN", lp_token)
  console.log("GAMERSE_POOL", gamersePool)
  console.log("lfg_token", lfg_token)


  return (
    <div className='container'>
      <div className='row'>

        <div className='col-sm-6'>
          <h2>Data:</h2>
          <p>Balance:{balance ? balance : "Click to check "}BNB</p>
          <p>allowance:{allowance ? allowance : "Click to check "}</p>

        </div>

        <div className='col-sm-6'>
          <h2>Change data</h2>
          <button onClick={getBalance}>Check Balance</button>
          <button onClick={checkAllowance}>Check Allowance</button>
          <button onClick={getApprove}>Approve</button>
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>




          <form className="form-inline" onSubmit={e => updateData(e)}>
            <input
              type="text"
              className="form-control"
              placeholder="data"
            />
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;