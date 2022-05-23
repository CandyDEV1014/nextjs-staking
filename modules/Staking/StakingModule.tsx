import React, { useState, useEffect } from 'react'
import { images } from '../../assets/image'
import StakingTabs from './StakingTabs'
import { ethers } from 'ethers'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getBlockNumber, getGamersePool, getLP_Token } from '../../api'
import { saveDepositAmountAction } from '../../store/actions'
import moment from 'moment'
const initStakingData = [
    {
        id: 1,
        role: "Moon Pool",
        apyDays: 90,
        percentage: "60.00",
        finished: true,
        isDeposit: false,

    },]

function StakingModule() {

    const [depositedAmount, setDeposit] = useState('')
    const [selectedStakingData, setSelectedStakingData] = useState<any>(undefined)
    const [lastStaked, setLastStaked] = useState<any>(undefined)
    const [lp_token, setLpToken] = useState<any>();
    const [balance, setBalance] = useState<string>('')
    const [userAdd, setUserAdd] = useState<string>('')

    const [pendingRewards, setPendingRewards] = useState<string>('')
    const [penaltyFee, setPenaltyFee] = useState<string>('')
    const [redeemableAmount, setRedeemableAmount] = useState<string>('')
    const router = useRouter()

    const dispatch = useDispatch()

    const [gamersePool, setGamersePool] = useState<any>(undefined);
    const [gamersePoolBalance, setGamersePoolBalance] = useState<any>(undefined);
    const [programDuration, setProgramDuration] = useState('')
    useEffect(() => {
        setWallet()

    }, [])

    useEffect(() => {
        if (gamersePool) {
            getUSer()
            compareBlockNumber()
        }
    }, [gamersePool])

    useEffect(() => {
        if (userAdd && gamersePool) {
            getPendingRewars()
            const pendingTime = setInterval(() => {
                console.log("interval")
                getPendingRewars()
            }, 10000)
        }
    }, [userAdd, gamersePool])

    const compareBlockNumber = async () => {
        let endBlockNumber = await gamersePool.bonusEndBlock()
        let endNumber = ethers.utils.commify(endBlockNumber)
        if (endNumber.includes(',')) {
            endNumber = endNumber.replace(/\,/g, '')
        }

        let blockNumber: any = await getBlockNumber()
        console.log("programDuration:-=-=-=", blockNumber, (Number(endNumber) - Number(blockNumber.providerBlockNum)) / 26772)
        setProgramDuration(`${((Number(endNumber) - Number(blockNumber.providerBlockNum)) / 26772).toFixed(2)}`)
    }




    const getPendingRewars = async () => {
        if (!gamersePool) return
        try {
            const tx = await gamersePool.pendingReward(userAdd)
            setPendingRewards(Number(ethers.utils.formatEther(tx)).toFixed(4))
        } catch (error) {
            console.log("errors:-=-=-=", error)
        }


    }

    const getRedeemableAmount = async () => {
        if (!gamersePool) return
        const tx = await gamersePool.redeemableAmount(userAdd)
        setRedeemableAmount(Number(ethers.utils.formatEther(tx)).toFixed(4))

    }

    const setWallet = async () => {
        try {
            console.log("set wallet")
            let data: any = await getLP_Token()
            console.log("lp token:-=-=-=", data)
            try {
                const balance = await data.lp_token.balanceOf(process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string)
                setGamersePoolBalance(Number(ethers.utils.formatEther(balance)).toFixed(2))
                onGetGamerPools()
            } catch (error) {
                console.log("balance error:-=-=", error)
            }

            setLpToken(data.lp_token)

            getBalance(data.lp_token)

        } catch (error) {
            console.log("set wallet error:-=-=", error)
        }


    }

    const getBalance = async (lpToken: any) => {
        const signerAddress = await lpToken.signer.getAddress()
        setUserAdd(signerAddress)
        const signerBalance = ethers.utils.formatEther(await lpToken.balanceOf(signerAddress))
        setBalance(signerBalance)
        dispatch(saveDepositAmountAction(signerBalance))
    }

    const getUSer = async () => {
        try {
            if (!lp_token) return
            const userInfo = await gamersePool.userInfo(await lp_token.signer.getAddress())
            setDeposit(ethers.utils.formatEther(userInfo[0]))

            let bigNum = ethers.utils.commify(userInfo[4])
            if (bigNum.includes(',')) {
                bigNum = bigNum.replace(/\,/g, '')
            }

            let dd = moment(moment.unix(Number(bigNum)).format("DD MMM YYYY"))
            let staked = moment(moment().format("DD MMM YYYY")).diff(dd, 'd')
            console.log("differnece Datte", staked)
            setLastStaked(staked)
            userInfo.map((hex: any, i: number) => {
                console.log("userInfo", i, ethers.utils.formatEther(hex))
            })
        } catch (error) {
            console.log("get User error:-=-=", error)
        }

    }
    const onGetGamerPools = async () => {
        try {
            const data: any = await getGamersePool()
            console.log("gamepools:-=-==", data)

            let penaltyF = await data.gamersePool.penaltyFee()
            // let withdraw = await data.gamersePool.withdrawLock()
            setPenaltyFee(ethers.utils.formatEther(penaltyF))

            setGamersePool(data.gamersePool)
        } catch (error) {
            console.log("get gamers pool error:-=-=", error)
        }

    }


    const handleStackDeposit = () => {
        getUSer()
        getBalance(lp_token)
    }

    const calculateCurrentPenalty = () => {
        if (pendingRewards && penaltyFee && (balance && Number(balance) > 0) && (depositedAmount && Number(depositedAmount) > 0)) {
            let pFee = `${(Number(pendingRewards) * Number(penaltyFee) / 10000)}`.split('.')
            if (pFee && pFee.length > 0) {
                return `${pFee[0]}.${pFee[1][0]}${pFee[1][1]}`
            }
        }

        return `0`
    }


    const showCurrentPenalty: Function = async () => {
        if (gamersePool) {
            let userInfo = await gamersePool.userInfo(userAdd)
            let penaltyUntil = ethers.utils.formatEther(userInfo[1])
            let blockTimestamp = new Date().valueOf() / 1000
            return Number(penaltyUntil) <= blockTimestamp ? true : false
            return true
        }

        else false
    }

    return (
      <div className="At-Assetpageholder">

        <section className="At-SectionGap-B35 ">
            <div className="container At-Container">
                <div className="row">
                    <div className="col-12">
                        <div className="At-PageTitle">
                            <h1 className="At-ColorBlue">Gamerse Staking Pool</h1>
                            <h2 className="At-FRegular">
                                Choose your pool and get rewarded for staking $LFG and $LP tokens
                            </h2>
                            {/* <p>Balance: {balance} $LP</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='container At-Container center' >
                <div className="At-NStakingWrapper">
                    <div className="row justify-content-between">
                        <div className="col-5 px-xl-5 px-2">
                            <div className="row ">
                                <div className="w-25 center">
                                    <h2>%</h2>
                                </div>
                                <div className="w-75">
                                    <p className='fs-5'>
                                        APY
                                    </p>
                                    <p className='fs-5'>{gamersePoolBalance && Number(gamersePoolBalance) > 0 ? ((10 * (0.17 / 0.17)) * Number(gamersePoolBalance)) / 100 : 0} %</p>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="w-25 center">
                                    <h2>LP</h2>
                                </div>
                                <div className="w-75">
                                    <p className='fs-5'>
                                        Amount Staked
                                    </p>
                                    <p className='fs-5'>{depositedAmount ? depositedAmount : 0} LP</p>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="w-25 center">
                                    <img src={images.logoMain.src} className='img-fluid ' width={30} alt="" />
                                </div>
                                <div className="w-75">
                                    <p className='fs-5'>
                                        Current rewards
                                    </p>
                                    <p className='fs-5'>{pendingRewards ? pendingRewards : 0} LFG</p>
                                </div>
                            </div>

                            <div className="row mt-3 At-NStackDetail">
                                <div className="col-12 d-flex align-items-center border justify-content-between p-3">
                                    <p>Last Staked :</p>
                                    <h3>{(depositedAmount && Number(depositedAmount) > 0) && (!isNaN(lastStaked)) ? lastStaked === 0 ? 'Today' : `${lastStaked} day(s) ago` : 'N/A'}</h3>
                                </div>
                            </div>
                            <div className="row mt-2 At-NStackDetail">
                                <div className="col-12 d-flex align-items-center border justify-content-between p-3">
                                    <p>Current Penalty :</p>
                                    {showCurrentPenalty() && <h3>{calculateCurrentPenalty()}</h3>}
                                </div>
                            </div>

                        </div>
                        <div className="col-6 ps-2">
                            <StakingTabs programDuration={programDuration} gamersePool={gamersePool} balance={balance} handleStackDeposit={handleStackDeposit} depositedAmount={depositedAmount} lp_token={lp_token} />
                        </div>


                    </div>



                </div>
            </div>
        </section>
    </div>
    )
}

export default StakingModule
