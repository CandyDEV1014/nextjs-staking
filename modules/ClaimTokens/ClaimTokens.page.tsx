import { message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getLFGVesting } from '../../api';
import { images } from '../../assets/image'

function ClaimTokensPage() {

    const router = useRouter()
    router.replace('/')
    // const [connectWallet, setConnectWallet] = useState(false)
    const [walletPopup, setWalletPopup] = useState(false)
    const [lfgVesting, setLfgVesting] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false)
    const [hash, setHash] = useState<string>('')


    const connectWallet = async () => {
        try {

            if (!window.ethereum) {
                window.open('https://metamask.io')
                return
            }
            setLoading(true)
            let data: any = await getLFGVesting()
            console.log("Data:-=-=", data)
            if (data.success) {
                setLfgVesting(data.lfgVesting)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {

        // handleScroll()
        connectWallet()
    }, [])

    const handleScroll = () => {
        window.scrollTo(0, 100)
    }

    const notify = (value: string) => message.error(value, 2);

    const onClaimTokens = async () => {
        try {
            if (!lfgVesting) return
            setLoading(true)
            let claim = await lfgVesting.claimDistribution()
            await claim.wait()

            console.log("claim:-=-=", claim)
            setLoading(false)
        } catch (error: any) {
            console.log("error", error)
            notify(error.data.message);
        }

    }

    return (
        <div className="At-Assetpageholder">
            <section className="At-SectionGap-B35 At-SectionStakin pt-5">
                <div className="container At-Container1275 pt-5">
                    <div className="row mt-5">
                        <div className="col-12 mt-5">
                            <div className="At-PageTitle mt-5">
                                <h1>Claim <span className="At-ColorBlue">$LFG</span> Tokens</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container w-25'>
                    <div className="At-ConnectWalletPopup">
                        {
                            lfgVesting
                                ?
                                (hash ?
                                    <div className="w-100 mt-1">

                                        <button className='At-Btn w-100' ><a target='_blank' href={`https://bscscan.com/tx/${hash}`}>view transaction</a></button>
                                    </div>
                                    : <div className="w-100 mt-1">

                                        <button className='At-Btn w-100' onClick={() => onClaimTokens()}>Claim Tokens</button>
                                    </div>)

                                :
                                <button className="At-Btn AtBlueBorderBtn" onClick={() => connectWallet()}>
                                    Connect Metamask
                                </button>

                        }
                    </div>

                </div>
            </section>
        </div>
    )
}


export default ClaimTokensPage
