import { message, Modal } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { getLP_Token } from '../../api'
import { images } from '../../assets/image'
// import './wallet.scss'
// import { routes } from '../../routes/routes'
import AddFundPopup from './AddFundPopup'

function ConnectWallet({ open, onClose, setWallet, lp_token }: any) {
    const main = 'mian',
        connecting = 'connecting',
        connected = 'connected'

    const [loading, setLoading] = useState<boolean>(false)
    const [layout, setLayout] = useState(main)
    const [FundPopup, setFundPopup] = useState(false)
    const [error, setError] = useState('')
    const [isMetaMaskConnected, setIsMetamaskConnected] = useState<boolean>(false)

    const connectWallet = async () => {
        if (!isMetaMaskConnected) {
            window.open('https://metamask.io')
            return
        }
        setLoading(true)
        setLayout(connecting)
        let data: any = await getLP_Token()
        console.log("Data:-=-=", data)
        if (data.success) {
            setWallet(data.lp_token)
            setFundPopup(true)
            onClose()
            setLoading(false)
            setLayout(connected)
        } else {
            setLayout(main)
            setError(data.message)
        }
    }

    // useEffect(() => {
    //     if (lp_token) {
            
    //     }
    // }, [lp_token])

    useEffect(() => {
        if (open) {
            setLayout(main)
            if (window.ethereum) {
                setIsMetamaskConnected(true)
            } else {
                setIsMetamaskConnected(false)
            }
        }
    }, [open])


    const mainLayout = (
        <Fragment>
            <p className='text-grey'>By connecting your wallet, you agree to our <br />
                <b>Terms of Services</b> and our <b>Privacy Policy</b>
            </p>

            {error && <p>{error}</p>}
            <div className="At-MetaMask" onClick={() => connectWallet()}>
                <p>
                    {isMetaMaskConnected ? "MetaMask" : "Please install Metamask"}
                </p>
                <figure>
                    <img src={images.metaMask.src} className='img-fluid' alt="" />
                </figure>
            </div>
        </Fragment>
    )

    const connectingLayout = (
        <Fragment>
            <p className='text-grey'>
                MetaMask wallet details screen with <br />
                data will come here
            </p>
            <div className="spinner-border text-green mt-4 fs-5" style={{ width: '3rem', height: '3rem' }} role="status">
            </div>
            <p className='fs-6 mt-3 text-black'>Loading to Connect</p>
            <div className='pb-4'></div>
        </Fragment>
    )

    const connectedLayout = (
        <Fragment>
            <p className='text-grey'>
                You have connected your wallet successfully
            </p>
            <i className="icon-check-fill At-ColorGradient mt-4" style={{ fontSize: '4rem' }}></i>
            <h5 className='mt-4'>Wallet Connected</h5>
            <p className='fs-6 text-grey'>Please see your wallet in your profile</p>
            <div className='pb-4'></div>
        </Fragment>
    )

    const handleLayout = (l: string) => {
        if (l === connecting) {
            return connectingLayout;
        }
        if (l === connected) {
            return connectedLayout;
        }
        return mainLayout;
    }

    const handleTitle = (l: any) => {
        if (l === connecting) {
            return 'Connecting';
        }
        if (l === connected) {
            return 'Connected';
        }
        return 'Connect Your Wallet';
    }

    return (
        <Fragment>
            <Modal
                title={<h4>{handleTitle(layout)}</h4>}
                centered
                visible={open}
                className="At-ProfilePopup"
                closable={true}
                footer={null}
                onCancel={() => onClose()}
            >
                <div className="At-ConnectWalletPopup">
                    {
                        handleLayout(layout)
                    }

                </div>
            </Modal>
            <AddFundPopup open={FundPopup} lp_token={lp_token} onClose={setFundPopup} />
        </Fragment>

    )
}

export default ConnectWallet