import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Modal } from 'antd'
import { DebounceInput } from 'react-debounce-input'
import { images } from '../../assets/image'
import { ethers } from 'ethers'
import { getGamersePool } from '../../api'
import Loader from '../../components/Loader/Loader';
import styles from './Wallet.module.scss';
import { AddStatAction } from '../../api/bakcend.api'
import Link from 'next/link'
import { useRouter } from 'next/router'

function StackToken({ open, onClose, balance, lp_token, gamersePool, handleStackDeposit, selectedStakingData, minAmountToStake }: any) {
    const main = 'mian',
        stack = 'stack',
        deposit = 'deposit',
        successfully = 'successfully'
    const [layout, setLayout] = useState(stack)
    const [title, setTitle] = useState("Stake")
    const [amount, setAmount] = useState<number>()
    const [isValidAmount, setisValidAmount] = useState<boolean>(false)
    const [validatingLoader, setValidatingLoader] = useState<boolean>(false)
    const [isWithDraw, setIsWithDraw] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('');
    const [max, setMax] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    const getApprove = async () => {
        setLoading(true)
        setTitle('Unlocking Wallet')
        setLayout(main)
        const tx = await lp_token.approve(process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string, ethers.utils.parseEther(String(amount)).toString())
        await tx.wait()
        console.log("tx:-=-=-=-=approve:-=-=-=-=-=-=", tx)
        setLoading(false)
        setTitle("Deposit")
        setLayout(deposit)
    }

    const handleDeposit = async () => {
        setLoading(true)
        setTitle('Unlocking Wallet')
        setLayout(main)
        const tx = await gamersePool.deposit(ethers.utils.parseEther(String(amount)).toString())
        await tx.wait()
        console.log("tx:-=-=-=-=deposit:-=-=-=-=-=-=", tx)
        if (amount) {
            console.log("amount", amount)
            let data = {
                hash: tx.hash,
                from: tx.from,
                amount: amount,
                type: 'deposit'
            }

            let res = await AddStatAction(data)
        }
        setLoading(false)
        handleStackDeposit()
        setTitle("Trasnsaction Successful")
        setLayout(successfully)
    }

    const handleClosePopup = () => {
        onClose()
        setLayout(main)
        setTitle('Unlocking Wallet')

    }

    const validateAmount = async (a: number) => {
        if (a > Number(balance)) {
            setError(`You don't have ${a} tokens in your wallet to stake`)
            return
        }
        setValidatingLoader(true)
        setError('')
        const tx = await lp_token.allowance(await lp_token.signer.getAddress(), process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string)
        let avalAmount = ethers.utils.formatEther(tx)
        setValidatingLoader(false)
        if (Number(avalAmount) <= a) {
            setisValidAmount(true)
        } else if (Number(avalAmount) >= a) {
            setTitle("Deposit")
            setLayout(deposit)
            setisValidAmount(false)
        } else {

            setisValidAmount(false)
        }
    }

    const onChangeAmount = (e: any) => {
        setAmount(e.target.value)
        if (e.target.value) {
            validateAmount(e.target.value)
        }
    }

    const updateMaxAmount = () => {
        setAmount(Number(balance));
        setMax(max + 1)
    }
    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [max])

    // useEffect(() => {


    // },[gamersePool])
    const mainLayout = (
        <Fragment>
            <p className='text-grey'>
                Unlocking your MetaMask Wallet<br />
                Please Wait...
            </p>
            <div className="spinner-border text-green mt-4 fs-5" style={{ width: '3rem', height: '3rem' }} role="status">
            </div>
            <p className='fs-6 mt-3 text-black' >Loading</p>
            <div className='pb-4'></div>
        </Fragment>
    )

    const connectingLayout = (
        <Fragment>
            <div className="w-100">
                <p className='text-grey text-start'>
                    How many tokens you want to stake?
                </p>
                <form className="At-HeaderSearch mt-2">
                    <div className="At-FormGroup At-FormGroupIcon">
                        <DebounceInput
                            inputRef={inputRef}
                            className="form-control At-FormControl border p-3 At-NumberInput"
                            type="number"
                            placeholder="5000"
                            aria-label="text"
                            debounceTimeout={1500}
                            value={amount}
                            onChange={onChangeAmount}
                        />
                        <span onClick={updateMaxAmount} className={`${styles.claimInputBtn} position-absolute`} >Max</span>
                        {!error ? <div className='text-start mt-1'> <p className='text-grey' style={{ fontSize: "12px" }}>Stake min {minAmountToStake} to participate in NFT air drop</p></div> :
                            <div className='text-red text-start mt-1'>{error}</div>}
                    </div>

                </form>
            </div>
            <button className='At-LightButton At-FBold w-100 mt-3 text-center' disabled={!isValidAmount || error ? true : false || !amount} onClick={() => getApprove()}>{validatingLoader ? <Loader /> : 'Approve'}</button>
        </Fragment>
    )

    const DepositLayout = (
        <Fragment>
            <p className='text-grey'>
                Deposit
            </p>
            <i className="icon-check-fill At-ColorGradient mt-4" style={{ fontSize: '4rem' }}></i>
            <p className='mt-4 text-black'>Deposit {amount} Tokens</p>
            <div className='pb-4'></div>
            <button className='At-LightButton At-FBold w-100 mt-3 text-center' disabled={loading} onClick={() => handleDeposit()}>{loading ? 'Wait...' : 'Deposit'}</button>
        </Fragment>
    )

    const connectedLayout = (
        <Fragment>
            <p className='text-grey'>
                Successfully staked {amount} Tokens <br /> Congratulations...
            </p>
            <i className="icon-check-fill At-ColorGradient mt-4" style={{ fontSize: '4rem' }}></i>
            <p className='mt-4 text-black'>{amount} Tokens staked <Link href={"/stats"}><a className='At-LinkBlue'>See transaction</a></Link></p>
            
            <div className='pb-4'></div>
        </Fragment>
    )

    return (
        <Modal
            title={<h4>{title}</h4>}
            centered
            visible={open}
            className="At-ProfilePopup"
            closable={true}
            footer={null}
            onCancel={() => handleClosePopup()}
        >
            <div className="At-ConnectWalletPopup">
                {(() => {
                    switch (layout) {
                        case main:
                            return mainLayout;
                        case stack:
                            return connectingLayout;
                        case deposit:
                            return DepositLayout;
                        case successfully:
                            return connectedLayout;
                        default:
                            break;
                    }
                })()}

            </div>
        </Modal>
    )
}

export default StackToken
