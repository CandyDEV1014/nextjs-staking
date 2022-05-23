import { Modal } from 'antd';
import { ethers } from 'ethers';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { AddStatAction } from '../../api/bakcend.api';
import styles from './Wallet.module.scss'

function ConnectedWalletPopup({ open, onClose, gamersePool, lp_token, depositAmount, handleStackDeposit }: any) {

    const [amount, setAmount] = useState<number>()
    const [loading, setLoading] = useState<boolean>(false);
    const [max, setMax] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const onWithdraw = async () => {
        if (!validateAmount()) {
            alert('Value must be less then deposit.')
            return
        }
        setLoading(true)
        const userInfo = await gamersePool.userInfo(await lp_token.signer.getAddress())
        userInfo.map((hex: any, i: number) => {
            console.log("userInfo", i, ethers.utils.formatEther(hex))
        })
        if (!gamersePool) return
        const withdraw = await gamersePool.withdraw(ethers.utils.parseEther(String(amount)).toString())
        await withdraw.wait()

        if (amount) {
            console.log("amount", amount)
            let data = {
                hash: withdraw.hash,
                from: withdraw.from,
                amount: amount,
                type: 'withdraw'
            }

            let res = await AddStatAction(data)
        }
        handleStackDeposit()
        onClose()
        setLoading(false)
        console.log("withdraw", withdraw)
    }

    const validateAmount = () => {
        if (Number(amount) > Number(depositAmount)) {
            console.log("condition run")
            return false
        }
        return true
    }

    const onChangeAmount = (e: any) => {
        setAmount(e.target.value)
        console.log("eeee", e.target.value)
    }

    const updateMaxAmount = () => {
        setAmount(Number(depositAmount));
        setMax(max + 1)
    }
    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [max])

    return (
        <Modal
            title={<h4>Withdraw</h4>}
            centered
            visible={open}
            className="At-ProfilePopup"
            closable={true}
            footer={null}
            onCancel={() => onClose()}
        >
            <div className="At-ConnectWalletPopup">
                <p className='text-grey'>
                    Early withdrawal disclaimer: <small>Early withdrawal within the first 30 days will result in 50% of rewards being burned.</small>
                </p>
                {!loading && <>
                    <form className="w-100 mt-4">
                        <div className="At-FormGroup position-relative ">
                            <input
                                ref={inputRef}
                                className="form-control At-FormControl border p-3 At-NumberInput"
                                type="number"
                                placeholder="5000"
                                aria-label="text"
                                value={amount}
                                onChange={onChangeAmount}
                            />

                            <span onClick={updateMaxAmount} className={`${styles.claimInputBtn} position-absolute`} >Max</span>
                            {!validateAmount() &&
                                <div className='text-red text-start mt-1'>Unstake amount must be less than deposit amount</div>}
                        </div>
                    </form>
                    <button type="button" className='At-LightButton At-FBold w-100 mt-2 text-center' disabled={loading || !validateAmount() || !amount} onClick={() => onWithdraw()}>{loading ? 'Wait ...' : 'Unstake'}</button>
                </>}

                {/* <div className='pb-4'></div> */}

                {loading && <Fragment>
                    <p className='text-grey'>
                        Please Wait...
                    </p>
                    <div className="spinner-border text-green mt-4 fs-5" style={{ width: '3rem', height: '3rem' }} role="status">
                    </div>
                    <p className='fs-6 mt-3 text-black' >Loading</p>
                    <div className='pb-4'></div>
                </Fragment>}
            </div>
        </Modal>
    )
}

export default ConnectedWalletPopup
