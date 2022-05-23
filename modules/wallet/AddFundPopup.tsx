import { Modal } from 'antd'
import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { images } from '../../assets/image'
import { useRouter } from 'next/router'
import { saveTokenAction } from '../../store/actions'


function AddFundPopup({ open, onClose, lp_token }: any) {

    const router = useRouter()
    const dispatch = useDispatch()
    const main = 'mian',
        keyLay = 'keyLayout',
        connected = 'connected'
    const [layout, setLayout] = useState(main)
    const [title, setTitle] = useState('Add LFG To Your Wallet')

    const hanldeLayout = (lay: string) => {
        if (lay == keyLay) {
            setLayout(lay)
            setTitle('Deposit LFG From Your Echange')
        }
        if (lay == connected) {
            setLayout(lay)
            setTitle('Wallet')
        }
    }

    const mainLayout = (
        <Fragment>
            <p className='text-grey'>
                Select one of the options to deposit <br />
                LFG to your wallet
            </p>
            <button className='At-LightButton At-FBold w-100 mt-4 text-center' onClick={() => hanldeLayout(keyLay)}>Deposit From An Exchange</button>
        </Fragment>
    )

    const keyLayout = (
        <Fragment>
            <p className='text-grey'>
                Deposit LFG from your exchangeinfo to <br />
                the following address:
            </p>
            <div className="w-100 center-between mt-3">
                <div className=" p-1">
                    <p>0x960a69E979d2F507E80121f41d984Ea8aD83cD76</p>
                </div>
                <div>
                    <i className="icon-copy ms-2 fs-4 text-silver cursor-pointer"></i>
                </div>
            </div>
            {/* <p className='text-grey mt-2'>
                Only send LFG or any other BEP-20 token <br />
                to this address
            </p> */}
            <div className='py-2'>
                <h5>
                You can use link below to buy LFG tokens
                </h5>


                {/* <h6 className='text-blue mt-3'>
                    <a href="https://www.dextools.io/app/bsc/pair-explorer/0xcca6df3c9e888ba411de5b4452c43356ee15f44e" target="_blank">
                        DEX tools
                    </a>
                </h6>

                <h6 className='text-blue mt-2'>
                    <a href="https://coinmarketcap.com/currencies/gamerse/" target="_blank">
                        CMC
                    </a>
                </h6>

                <h6 className='text-blue mt-2'>
                    <a href="https://www.coingecko.com/en/coins/gamerse " target="_blank">
                        Coingecko
                    </a>
                </h6> */}

                <h6 className='text-blue mt-2'>
                    <a href="https://pancakeswap.finance/swap?outputCurrency=0x960a69e979d2f507e80121f41d984ea8ad83cd76" target="_blank">
                        PancakeSwap
                    </a>
                </h6>
            </div>
            <button className='At-LightButton At-FBold w-100 mt-4 text-center' onClick={() => hanldeLayout(connected)}>I’ve Made My Deposit</button>
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

    const handlePopup = () => {
        onClose(!open)
        // dispatch(saveTokenAction({name: "waleed AZHar"}))
        if (lp_token) {
            router.push({
                pathname: 'StakingPool',
            })
        }
        // history.push(routes.stakingPool)
    }

    return (
        <Modal
            title={<h4>{title}</h4>}
            centered
            visible={open}
            className="At-ProfilePopup"
            closable={true}
            footer={null}
            onCancel={() => handlePopup()}
        >
            <div className="At-ConnectWalletPopup">
                {(() => {
                    switch (layout) {
                        case main:
                            return mainLayout;
                        case keyLay:
                            return keyLayout;
                        case connected:
                            return connectedLayout;
                        default:
                            break;
                    }
                })()}

            </div>
        </Modal>
    )
}

export default AddFundPopup
