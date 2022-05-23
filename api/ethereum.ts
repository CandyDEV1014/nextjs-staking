import detectEthereumProvider from '@metamask/detect-provider';
import { message } from "antd";
import Web3 from "web3";
import { ethers, Contract } from 'ethers';
import LP_Token from './LP_Token.json';
import GamersePool from './GamersPool.json'
import LFGVesting from './LFGVesting.json'
import LFG_Token from './LFG_Token.json'
var provider: any
var signer: any
export const getLP_Token = () =>
    new Promise(async (resolve, reject) => {
        provider = await detectEthereumProvider();
        console.log("Provider",provider)
        if (provider) {
            await provider.request({ method: 'eth_requestAccounts' });
            const networkId = await provider.request({ method: 'net_version' })
            console.log("networkId", networkId)

            provider = new ethers.providers.Web3Provider(provider);
            // console.log("Provider2",provider)

            signer = provider.getSigner();
            
            const lp_token = new Contract(
                process.env.NEXT_PUBLIC_GAMERSE_LP_TOKKEN_ADDRESS as string,
                LP_Token.abi,
                signer
            );
            resolve({ success: true, lp_token, message: 'connected' });
            return;
        }
        reject({ success: false, message: 'Install Metamask' });
    });

export const getGamersePool = () =>
    new Promise(async (resolve, reject) => {

        if (provider) {

            const gamersePool = new Contract(
                process.env.NEXT_PUBLIC_GAMERSE_GAMERSE_POOL_ADDRESS as string,
                GamersePool.abi,
                signer
            );


            resolve({ gamersePool });
            return;
        }
        reject('Install Metamask');
    });

//    export const sendAlert = async () => {
//         let gamers: any = await getGamersePool()

//         if(gamers.gamersePool){
//             console.log("aaaa function call hoya")
//             gamers.gamersePool.on('Deposit', (user: any, amount: any)  => {
//               console.log("depost socket:--=-=", user, "amount:-=-=", amount)
//             })

//             gamers.gamersePool.on('Withdraw', (user: any, amount: any)  => {
//               console.log("claim socket:--=-=", user, "amount:-=-=", amount)
//             })
//         }
//         // Deposit()
//     }


export const getLFG_Token = () =>
    new Promise(async (resolve, reject) => {

        if (provider) {

            const lfg_token = new Contract(
                process.env.NEXT_PUBLIC_GAMERSE_LFG_TOKKEN_ADDRESS as string,
                LFG_Token.abi,
                signer
            );
            resolve({ lfg_token });
            return;
        }
        reject('Install Metamask');
    });

export const getBlockNumber = () => {
    return new Promise(async (resolve, reject) => {
        if (provider) {
            try {
                const providerBlockNum = await provider.getBlockNumber()
                resolve({ providerBlockNum })
                return
            } catch (error) {
                reject(false)
            }
        }
        reject('Install Metamask');
    })
}


export const detectProvider = async () => {
    let currentProvider = await detectEthereumProvider();
    return currentProvider ? true : false
}


export const providerListner = async () => {
    if (provider) {
        const web3 = new Web3(provider);
        //provider.enable();
        provider.on("networkChanged", function (networkId: any) {
            // 97, 56
            if (networkId === 97 || networkId === 56) {
                window.location.reload();
            } else {
                message.error(
                    "Please try again after connect Binance Smart Chain Network on metamask"
                );
                window.location.reload();
            }
        });
    }
}

export const getLFGVesting = () =>
    new Promise(async (resolve, reject) => {
        provider = await detectEthereumProvider();
        if (provider) {
            await provider.request({ method: 'eth_requestAccounts' });
            const networkId = await provider.request({ method: 'net_version' })
            console.log("networkId", networkId)

            provider = new ethers.providers.Web3Provider(provider);
            // console.log("Provider2",provider)

            signer = provider.getSigner();

            const lfgVesting = new Contract(
                process.env.NEXT_PUBLIC_GAMERSE_LFGVESTING_ADDRESS as string,
                LFGVesting.abi,
                signer
            );


            resolve({ success: true, lfgVesting });
            return;
        }
        reject('Install Metamask');
    });