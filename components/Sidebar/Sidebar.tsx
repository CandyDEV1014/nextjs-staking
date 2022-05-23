import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';
import { images } from "../../assets/image";
import { useSelector } from 'react-redux';
import { tokenSelector } from '../../store/selectors';
import { GetUSAPrices } from '../../api/bakcend.api';
import { message } from 'antd';

export default function Sidebar() {
    const router = useRouter()

    const token = useSelector(tokenSelector)
    const [usdPrice, setUsdPrice] = useState<any>()

    const fetchPrice = async () => {
        let prices = await GetUSAPrices()
        console.log("prices:-=-=-=", prices)
        if (prices) {
            setUsdPrice(Number(prices.data.price).toFixed(3))
        }
    }

    const toastMessage = (val: string) => message.success(val, 2)
    useEffect(() => {
        fetchPrice()
    }, [])
    const sideBarClassHide = () => {
        const el = document.getElementById('sideBar');
    
        if(el){
          el.classList.remove("rt-showsidebar");
        }
    
      }
    return (
        <aside className='At-sidebarwrapper At-HideScroller' id="sideBar">
            <div className='At-sidebar'>
                {token.userAddress && <div className='At-copyurlarea' >
                    <div className='At-Url'  onClick={sideBarClassHide}>
                        <span onClick={() => router.push('/StakingPool')}>{token.userAddress ? `${token.userAddress.slice(0, 11)}...` : `Connect Wallet`}</span>

                         <CopyToClipboard text={token.userAddress}
                            onCopy={() => { toastMessage('Copied') }}>
                            <span className='At-btncopyurl'>
                                {/* <button className='At-btncopyurl'> */}
                                <img src={images.copy.src} alt="" />
                                {/* </button> */}
                            </span>
                        </CopyToClipboard>
                    </div>
                  { token.stakedAmount &&  <div className='At-sidebarltf'>
                        <figure>
                            <img src={images.logocopy.src} alt="logo" />
                        </figure>
                        <span>{token.stakedAmount ? token.stakedAmount : 20} LFG</span>
                    </div>}
                </div>}

                <div className='At-navigation'>
                    <nav className='At-Nav'>
                        <ul>
                            <li className={router.pathname === "/StakingPool" ? 'At-Active' : ''}  onClick={sideBarClassHide}>
                                <Link href="/StakingPool">
                                    <a>Staking</a>
                                </Link>
                            </li>
                            <li className={router.pathname === "/Assets" ? 'At-Active' : ''}  onClick={sideBarClassHide} >
                                <Link href="/Assets">
                                    <a>Avatar Assets</a>
                                </Link>
                            </li>

                            <li className={router.pathname === "/stats" ? 'At-Active' : ''}  onClick={sideBarClassHide}>
                                <Link href="/stats">
                                    <a>Stats</a>
                                </Link>
                            </li>
                            {/* <li className={router.pathname === "/claim-tokens" ? 'At-Active' : ''}>
                                <Link href="/claim-tokens">
                                    <a>Claim Tokens</a>
                                </Link>
                            </li> */}
                            <li>
                                <a href="https://docsend.com/view/kidq2cwt8uqpe3se" target="_blank" rel="noreferrer"   onClick={sideBarClassHide}> LFG tokenomics</a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
            <div className="AtSidebarFooter"  onClick={sideBarClassHide}>
                <div className="AtSidebarFooterInner">
                    <div className="AtSidebarImg">
                        <figure>
                            <img src={images.logocopy.src} alt="" />
                        </figure>
                        <a href='https://pancakeswap.finance/swap?outputCurrency=0x960a69e979d2f507e80121f41d984ea8ad83cd76' target="_blank" rel="noreferrer"><p>{usdPrice ? usdPrice : 0} USD</p></a>
                    </div>
                    <ul className='AtSidebarSocial'>
                        <li>
                            <Link href="https://www.facebook.com/Gamersenft">
                                <a target="_blank"><i className='icon-facebook'></i></a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://twitter.com/Gamersenft">
                                <a target="_blank"><i className='icon-twitter'></i></a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://t.me/gamersecommunity">
                                <a target="_blank">
                                    <i className='icon-telegram'></i>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://discord.com/invite/SVAXQ7rNrp">
                                <a target="_blank"><i className='icon-discord'></i></a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <Link href='https://www.gamerse.com/'>
                    <a target="_blank">https://www.gamerse.com/</a>
                </Link>
            </div>
        </aside>
    );
}