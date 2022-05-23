import React, { useEffect, useState } from "react";
import { images } from "../../assets/image";
import { tokenSelector } from "../../store/selectors";
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from "react-redux";
import { detectProvider, getGamersePool, getLP_Token } from "../../api";
import { useRouter } from 'next/router';
import { GetStatAction, GetTotalSupply, GetUSAPrices } from "../../api/bakcend.api";
import { ethers } from "ethers";
import QuickView from "../QuickView/QuickView";
import Link from "next/link";


function Header() {
  let depositAmount = useSelector(tokenSelector).depositAmount;

  const maxSuplly = 1000000000
  const router = useRouter()
  const [totalSupply, setTotalSupply] = useState<any>(0)
  const [balance, setBalance] = useState<string>("");
  const [lp_token, setLpToken] = useState<any>();
  const [count, setCount] = useState([])
  const [depositedAmount, setDeposit] = useState("");

  const [totalLFGStaked, setTotalLFGStaked] = useState<any>(undefined);

  // setTotalLFGStaked(Number(ethers.utils.formatEther(balance)).toFixed(2));

  const getTotolSupply = async () => {
    try {
      let lp: any = await getLP_Token()
      console.log("lp:=-=kp=dp=-=", lp)
      // if (lp.success) {
      let totalSuply = await lp.lp_token.totalSupply()

      const balance = await lp.lp_token.balanceOf(
        process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string
      );

      setTotalLFGStaked(Number(ethers.utils.formatEther(balance)).toFixed(2));
      setLpToken(lp.lp_token);
      getBalance(lp.lp_token)
      getDepositAmount(lp.lp_token)
      console.log("total supply:-=-=-=", ethers.utils.formatEther(totalSuply))
      setTotalSupply(Number(ethers.utils.formatEther(totalSuply)))
      // }
    } catch (error) {
      console.log(error)
    }

  }

  const getDepositAmount = async (lpToken: any) => {
    try {
      const data: any = await getGamersePool();
      const userInfo = await data.gamersePool.userInfo(
        await lpToken.signer.getAddress()
      );

      let prices = await GetUSAPrices()
      console.log("priceS:-=-=", prices)
      setDeposit(((Number(ethers.utils.formatEther(userInfo[0])) * Number(prices.data.price)).toFixed(2)))
    } catch (error) {
      console.log(error)
    }

  }

  const fetchStats = async (p: number = 1) => {
    try {

      let res = await GetStatAction({ limit: 10, page: p })
      if (res.success) {

        setCount(res.data.count)

      }
    } catch (error) {
      console.log(error)
    }
  }

  const getBalance = async (lpToken: any) => {
    try {

      console.log("get Balance:-=-")
      const signerAddress = await lpToken.signer.getAddress();
      // setUserAdd(signerAddress);
      const signerBalance = Number(
        ethers.utils.formatEther(await lpToken.balanceOf(signerAddress))
      ).toFixed(2);

      let prices = await GetUSAPrices()
      console.log("priceS:-=-=", prices)
      let priceINUse = (Number(signerBalance) * Number(prices.data.price)).toFixed(2)
      setBalance(priceINUse);
    } catch (error) {

    }
  };

  const checkProviderConnected = async () => {
    if (depositAmount) {
      try {
        let data: any = await detectProvider();
        if (!data) {
          window.location.reload();
        }
      } catch (error) {
        console.log(`error`, error);
      }
    }
  };

  const convertTotalLfg = (amount: any) => {
    let k = 1000
    let m = k * 1000
    let b = m * 1000

    if (amount >= b) {
      return `${(Number(amount) / b).toFixed(2)}B`
    }
    if (amount >= m) {
      return `${(Number(amount) / m).toFixed(2)}M`
    }

    if (amount >= k) {
      return `${(Number(amount) / k).toFixed(2)}K`
    }
    return `${(Number(amount).toFixed(2))}`
  }

  checkProviderConnected();

  useEffect(() => {
    getTotolSupply()
    fetchStats()
  }, [])

  useEffect(() => {
    if (lp_token && depositAmount) {
      getTotolSupply()
      // getDepositAmount(lp_token)
    }
  }, [depositAmount])

  const sideBarClassToggler = () => {
    const el = document.getElementById('sideBar');

    if(el){
      el.classList.toggle("rt-showsidebar");
    }

  }
  return (
    <header className="At-Header">
      <button className="rt-btnsidebartoggle" onClick={sideBarClassToggler}>
        <img src={images.menu.src} alt="" />
      </button>
      <strong className="At-Logo">
        <Link href="/">
          <a>
            <img
              src={images.logoMain.src}
              className="img-fluid"
              alt="logo"
            />
          </a>
        </Link>

      </strong>
      <div className="At-AddNavigation">
        <nav>


          <button className="At-TotalLtf">TVL:   {totalLFGStaked ? convertTotalLfg(totalLFGStaked) : 0}  </button>

          <button className="At-TotalLtf">Total stakers:   {count ? count : 0}</button>

          <button className="At-TotalLtf">Total Burn:  {totalSupply && totalSupply > 0 ? maxSuplly - totalSupply : 0} LFG</button>
          {(router.pathname !== "/terms-conditions") && <button className=" At-TotalLtf">
            Balance: &nbsp; {depositedAmount ? depositedAmount : "0.00"} USD
          </button>}
          {/* <button className="At-btnconnectmetamask">
            <figure>
              <img src={images.metamaskconnect.src} alt="metamask image" />
            </figure>
              <span>Connect Metamask</span>
          </button> */}
          {/* <div className="At-Profiledropdown">
            <Dropdown>
              <Dropdown.Toggle variant="" id="dropdown-basic">
                <figure className='At-UserImage'>
                  <img src={images.userimage.src} alt="user image" />
                </figure>
                <span>My Account</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Link href="/stats">
                  <Dropdown.Item >
                    Stats
                  </Dropdown.Item>
                </Link>
                <Link href="/Assets">
                  <Dropdown.Item>
                    Avatar Assets
                  </Dropdown.Item>
                </Link>
                <Dropdown.Item href="#/action-3">Claim tokens</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div> */}
        </nav>
      </div>
    </header>
  );
}

export default Header;
