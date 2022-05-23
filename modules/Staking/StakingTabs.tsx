import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import { images } from '../../assets/image';

import { ethers } from 'ethers'
import { DebounceInput } from 'react-debounce-input'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getBlockNumber, getGamersePool, getLP_Token } from '../../api'
import { saveDepositAmountAction } from '../../store/actions'


const { TabPane } = Tabs;

function StakingTabs({ lp_token, gamersePool, handleStackDeposit, depositedAmount, balance, programDuration }: any) {

    const [stakeAmount, setStakeAmount] = useState<string>()
    const [unStakeAmount, setUnStakeAmount] = useState<string>()
    const [isValidAmount, setisValidAmount] = useState<boolean>(false)
    const [approving, setApproving] = useState<boolean>(false)
    const [isStakingAmountApproves, setIsStakingAmountApproves] = useState<boolean>(false)
    const [validatingLoader, setValidatingLoader] = useState<boolean>(false)
    const [isWithDraw, setIsWithDraw] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [claimLoading, setClaimLoading] = useState(false)

    const getApprove = async () => {
        setApproving(true)
        console.log("approve:-=-=-=-=")
        const tx = await lp_token.approve(process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string, ethers.utils.parseEther(String(stakeAmount)).toString())
        await tx.wait()
        console.log("approve:-=-=-=-=", tx)
        setIsStakingAmountApproves(true)
        setApproving(false)

    }

    const handleDeposit = async () => {
        setLoading(true)

        const tx = await gamersePool.deposit(ethers.utils.parseEther(String(stakeAmount)).toString())
        await tx.wait()
        setLoading(false)
        console.log("deposit:-=-=-=-=-=", tx)
        handleStackDeposit()
        setStakeAmount('')
        setIsStakingAmountApproves(false)

    }



    const validateAmount = async (a: number) => {
        setValidatingLoader(true)
        const tx = await lp_token.allowance(await lp_token.signer.getAddress(), process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string)
        let avalAmount = ethers.utils.formatEther(tx)
        setValidatingLoader(false)
        if (Number(avalAmount) <= a) {
            setisValidAmount(true)
        } else if (Number(avalAmount) >= a) {
            setisValidAmount(true)
        } else {

            setisValidAmount(false)
        }
        console.log(" availabe amount:-=-=-=", avalAmount, "given amount:-=-=", a)
    }

    const onChangeStakeAmount = (e: any) => {
        setStakeAmount(e.target.value)
        console.log("eeee", e.target.value)
        if (e.target.value) {
            validateAmount(e.target.value)
        }
    }

    const onClickMaxStakeAmount = () => {
        setStakeAmount(balance)
    }


    /*************************************** UnStake Func ******************************************************* */



    const onWithdraw = async () => {
        if (!validateUnstakeAmount()) {
            alert('Value must be less then deposit.')
            return
        }
        setLoading(true)
        const userInfo = await gamersePool.userInfo(await lp_token.signer.getAddress())
        userInfo.map((hex: any, i: number) => {
            console.log("userInfo", i, ethers.utils.formatEther(hex))
        })
        if (!gamersePool) return
        const withdraw = await gamersePool.withdraw(ethers.utils.parseEther(String(unStakeAmount)).toString())
        await withdraw.wait()
        handleStackDeposit()
        setLoading(false)
        setUnStakeAmount('')
        console.log("withdraw", withdraw)
    }

    const validateUnstakeAmount = () => {
        if (Number(unStakeAmount) > Number(depositedAmount)) {
            console.log("condition run")
            return false
        }
        return true
    }

    const onChangeUnstakeAmount = (e: any) => {
        setUnStakeAmount(e.target.value)
        console.log("eeee", e.target.value)
    }

    const onClickMaxUnStakeAmount = () => {
        setUnStakeAmount(depositedAmount)
    }

    const onClickClaim = async () => {
        console.log("run claim:-=-=-=")
        if (!gamersePool) return
        setClaimLoading(true)
        const tx = await gamersePool.withdraw(0)
        await tx.wait()
        setClaimLoading(false)
    }


    return (
        <div className="At-NStackTabsWrapper">
            <Tabs defaultActiveKey="1">
                <TabPane tab={<p className='fs-4'>Stake</p>} key="1">
                    <div className="row">
                        <div className='w-100 d-flex align-items-center'>
                            <img src={images.logoMain.src} width={20} alt="" />
                            &nbsp;&nbsp;
                            <div>
                                <p>LP-BUSD PCS LP</p>
                                <h6>Available to stake : {balance}</h6>
                            </div>
                        </div>
                        <div className="w-100 mt-3">
                            <div className="At-NStakInputWrapper ps-3">
                                {/* <input type="text" placeholder="Amount:" /> */}
                                <DebounceInput
                                    className="form-control At-FormControl p-3 At-NumberInput"
                                    type="number"
                                    placeholder="Amount"
                                    aria-label="text"
                                    debounceTimeout={3000}
                                    value={stakeAmount}
                                    onChange={onChangeStakeAmount}
                                />
                                <div>
                                    <h4>{balance}</h4>
                                    <button onClick={() => onClickMaxStakeAmount()}>MAX</button>
                                </div>
                            </div>
                        </div>
                        <div className='px-4 d-flex align-items-center justify-content-center mt-4'>
                            <img src={images.logoMain.src} width={30} alt="" />
                            <div className='ms-3'>
                                <p className='fs-5'>Your Estimated Rewards</p>
                                <h4>24,214 LP/month</h4>
                            </div>
                        </div>
                        <div className="At-NStakBottomButtons">
                            <button type="button" disabled={!isValidAmount || loading} onClick={() => getApprove()}>{approving ? 'Wait...' : 'Approve'}
                            </button>
                            <button type="button" disabled={loading || approving || !isValidAmount || !isStakingAmountApproves} onClick={() => handleDeposit()}>{loading ? 'Wait...' : 'Stake'} </button>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab={<p className='fs-4'>Unstake</p>} key="2">
                    <div className="row">
                        <div className='w-100 d-flex align-items-center'>
                            <img src={images.logoMain.src} width={20} alt="" />
                            &nbsp;&nbsp;
                            <div>
                                <p>LP-BUSD PCS LP</p>
                                <h6>Available to unStake : {depositedAmount}</h6>
                            </div>
                        </div>
                        <div className="w-100 mt-3">
                            <div className="At-NStakInputWrapper ps-3">
                                <input type="number"
                                    className="form-control At-FormControl p-3 At-NumberInput"
                                    placeholder="5000"
                                    aria-label="text"
                                    value={unStakeAmount}
                                    onChange={onChangeUnstakeAmount} />
                                <div>
                                    <h4>{depositedAmount}</h4>
                                    <button type="button" onClick={() => onClickMaxUnStakeAmount()} >MAX</button>
                                </div>
                            </div>
                        </div>
                        <div className='px-4 d-flex align-items-center justify-content-center mt-4'>
                            <img src={images.logoMain.src} width={30} alt="" />
                            <div className='ms-3'>
                                <p className='fs-5'>Your Estimated Rewards</p>
                                <h4>24,214 LP/month</h4>
                            </div>
                        </div>
                        <div className="At-NStakBottomButtons">
                            <button style={{width: '80%'}} disabled={claimLoading} onClick={() => onClickClaim()}>
                                {claimLoading ? "WAIT..." : 'CLAIM'}
                            </button>
                        </div>

                        <div className="At-NStakBottomButtons">
                            {/* <button>
                                APPROVE
                            </button> */}
                            <button style={{width: '80%'}} disabled={loading || !validateUnstakeAmount()} onClick={() => onWithdraw()}>
                                {loading ? "WAIT..." : 'UNSTAKE & CLAIM'}
                            </button>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab={<p className='fs-4'>Stats</p>} key="3">
                    <div className="w-100 At-NStackStats">
                        <div className="w-100">
                            <p>LP Pool Total Rewards</p>
                            <h6>27,000,000</h6>
                        </div>
                        <div className="w-100">
                            <p>Daily Reward</p>
                            <h6>300,000 LFG</h6>
                        </div>
                        <div className="w-100">
                            <p>LP Pool Total Rewards</p>
                            <h6>13,000,000</h6>
                        </div>
                        <div className="w-100">
                            <p>Daily Reward</p>
                            <h6>144,444 LFG</h6>
                        </div>
                        <div className="w-100">
                            <p>Program Duration</p>
                            <h6>{programDuration} days</h6>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default StakingTabs
