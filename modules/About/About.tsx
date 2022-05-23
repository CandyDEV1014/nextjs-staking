import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { images } from "../../assets/image";
import Card from "../../components/Card/Card";
import { ethers } from "ethers";
import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getBlockNumber, getGamersePool, getLP_Token } from "../../api";
import { saveStakedAmountAction } from "../../store/actions";
import { statsSelector } from "../../store/selectors";
import { message, Row, Col } from 'antd';
import Countdown from "react-countdown";
import { GetAvatarAction } from "../../api/bakcend.api";
import AlertPopup from "../../components/Popups/AlertPopup";

export default function About() {

    const router = useRouter()
    const startDate = React.useRef(Date.now());
    const [depositedAmount, setDeposit] = useState("");
    const [lp_token, setLpToken] = useState<any>();
    const [balance, setBalance] = useState<string>("");
    const [userAdd, setUserAdd] = useState<string>("");
    const [error, setError] = useState<boolean>(false);


    const dispatch = useDispatch();

    const [gamersePool, setGamersePool] = useState<any>(undefined);
    const [totalLFGStaked, setTotalLFGStaked] = useState<any>(undefined);
    const [adStartBlock, setAdStartBlock] = useState<any>(undefined);
    const [blockNumber, setBlockNumber] = useState<any>(undefined);
    const [penaltyUntil, setPenaltyUntil] = useState<any>(undefined);

    const [showPopup, setShowPop] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [timePassed, setTimePassed] = useState<number>(0)
    const totalTime = Number(process.env.NEXT_PUBLIC_GAMERSE_AIR_DROP_TIME as string) * 24 * 60 * 60 * 1000

    useEffect(() => {
        setWallet();
        // fetchAvatar()
        // dispatch(emptyStatsAction([]))
    }, []);

    useEffect(() => {
        if (gamersePool) {
            getUSer();
            // sendAlert()
        }
    }, [gamersePool]);
    
    const setWallet = async () => {
        try {
            setLoading(true)
            let data: any = await getLP_Token();
            const balance = await data.lp_token.balanceOf(
                process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string
            );
            console.log("balance->", balance);
            // const user = await data.lp_token.balanceOf(
            //   process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string
            // );

            setTotalLFGStaked(Number(ethers.utils.formatEther(balance)).toFixed(2));
            onGetGamerPools();

            setLpToken(data.lp_token);

            getBalance(data.lp_token);
            setError(false);
        } catch (error) {
            setError(true);
            setLoading(false)
            setShowPop(true)
            notify('Please connect to BSC or BSC Testnet');

        }
    };

    const notify = (value: string) => message.error(value, 2);

    const getBalance = async (lpToken: any) => {
        const signerAddress = await lpToken.signer.getAddress();
        setUserAdd(signerAddress);
        const signerBalance = Number(
            ethers.utils.formatEther(await lpToken.balanceOf(signerAddress))
        ).toFixed(2);
        setBalance(signerBalance);
    };

    const getUSer = async () => {
        try {
            if (!lp_token) {
                return
            };
            const userInfo = await gamersePool.userInfo(
                await lp_token.signer.getAddress()
            );
            // console.log("user info:--=-=-=-=", userInfo);
            setDeposit(ethers.utils.formatEther(userInfo[0]));

            if (Number(ethers.utils.formatEther(userInfo[0])) < 10000) {
                // alert("You are not eligble for this page")
                setShowPop(true)
            }
            dispatch(saveStakedAmountAction(ethers.utils.formatEther(userInfo[0])))
            let bigNum = ethers.utils.commify(userInfo[3]);
            if (bigNum.includes(",")) {
                bigNum = bigNum.replace(/\,/g, "");
            }

            let dd = moment(moment.unix(Number(bigNum)).format("DD MMM YYYY"));
            let staked = dd.diff(moment(moment().format("DD MMM YYYY")), "d");

            compareBlockNumber();
            let newAdStartBlock = ethers.utils.commify(userInfo[5]);
            if (newAdStartBlock.includes(",")) {
                newAdStartBlock = newAdStartBlock.replace(/\,/g, "");
            }
            // console.log("newAdStartBlock:-=-=-=", newAdStartBlock);

            setAdStartBlock(Number(newAdStartBlock));
            // setShowTime(Number(newAdStartBlock) > 0);

            setPenaltyUntil(staked);
            userInfo.map((hex: any, i: number) => {
                // console.log("userInfo", i, ethers.utils.formatEther(hex));
            });
            setLoading(false)
        } catch (error) {
            setLoading(false)
            // console.log("get User error:-=-=", error);
        }
    };

    const onGetGamerPools = async () => {
        try {
            const data: any = await getGamersePool();

            let penaltyF = await data.gamersePool.penaltyFee();
            let newPenaltyFee = ethers.utils.commify(penaltyF);
            if (newPenaltyFee.includes(",")) {
                newPenaltyFee = newPenaltyFee.replace(/\,/g, "");
            }
            // let withdraw = await data.gamersePool.withdrawLock()

            let minAmount = await data.gamersePool.adMinStakeAmount();
            minAmount = ethers.utils.formatEther(minAmount);


            setGamersePool(data.gamersePool);
        } catch (error) {
            setLoading(false)
            // console.log("get gamers pool error:-=-=", error);
        }
    };

    const compareBlockNumber = async () => {
        let endBlockNumber = await gamersePool.bonusEndBlock();
        let endNumber = ethers.utils.commify(endBlockNumber);
        if (endNumber.includes(",")) {
            endNumber = endNumber.replace(/\,/g, "");
        }

        let newBlockNumber: any = await getBlockNumber();
        setBlockNumber(Number(newBlockNumber.providerBlockNum));
        // console.log(
        //   "programDuration:-=-=-=",
        //   newBlockNumber,
        //   (Number(endNumber) - Number(newBlockNumber.providerBlockNum)) / 26772
        // );

    };

    const onCloseAlertPopup = (val: any) => {
        router.push('/')
        setShowPop(val)
    }

    return (
        <Fragment>
            <div className="At-Assetpageholder">
                <div className="At-PageTitle ">
                    <h1 className="At-ColorBlue">Claim Gamerse NFT Avatar</h1>
                </div>
                <div className="row g-4 justify-content-center">
                    <div className="At-Aboutcardarea">
                        <Card
                            userAdd={userAdd}
                            id={'#12345'}
                            button={'Fire Edition 🔥'}
                            image={images.card.src}
                            title={'Gamerse Avatar nft'}
                            price={'Price'}
                            lfg={'500'}
                            // blur
                        />
                    </div>
                    <div className="At-Aboutcardarea">
                        <Card
                            userAdd={userAdd}
                            id={'#12345'}
                            button={'Fire Edition 🔥'}
                            image={images.card.src}
                            title={'Gamerse Avatar nft'}
                            price={'Price'}
                            lfg={'500'}
                            // blur
                        />
                    </div>
                    <div className="At-Aboutcardarea">
                        <Card
                            userAdd={userAdd}
                            id={'#12345'}
                            button={'Fire Edition 🔥'}
                            image={images.card.src}
                            title={'Gamerse Avatar nft'}
                            price={'Price'}
                            lfg={'500'}
                            // blur
                        />
                    </div>
                    <div className="At-Aboutcardarea">
                        <Card
                            userAdd={userAdd}
                            id={'#12345'}
                            button={'Fire Edition 🔥'}
                            image={images.card.src}
                            title={'Gamerse Avatar nft'}
                            price={'Price'}
                            lfg={'500'}
                            // blur
                        />
                    </div>
                    <div className="At-Aboutcardarea">
                        <Card
                            userAdd={userAdd}
                            id={'#12345'}
                            button={'Fire Edition 🔥'}
                            image={images.card.src}
                            title={'Gamerse Avatar nft'}
                            price={'Price'}
                            lfg={'500'}
                            // blur
                        />
                    </div>
                    <div className="At-Aboutcardarea">
                        <Card
                            userAdd={userAdd}
                            id={'#12345'}
                            button={'Fire Edition 🔥'}
                            image={images.card.src}
                            title={'Gamerse Avatar nft'}
                            price={'Price'}
                            lfg={'500'}
                            // blur
                        />
                    </div>
                </div>
            </div>
            {/* <AlertPopup show={showPopup} closePopup={onCloseAlertPopup} /> */}
        </Fragment>
    )
}