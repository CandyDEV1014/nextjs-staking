import axios from 'axios'

const url = `${process.env.NEXT_PUBLIC_GAMERSE_BACKEND_URL as string}`
export const AddStatAction = async (body: any) => {
    try {
        let res = await axios.post(`${url}/create-stat`, body)
        return { success: true }
    } catch (error) {
        console.log("error:", error)
        return { success: true }
    }
}


export const GetStatAction = async (data: any) => {
    try {
        let res = await axios.get(`${url}/stat`, { params: data })
        return { success: true, data: res.data }
    } catch (error) {
        console.log("error:", error)
        return { success: true, data: [] }
    }
}

export const AddAvatarAction = async (body: any) => {
    try {
        let res = await axios.post(`${url}/create-avatar`, body)
        return { success: true }
    } catch (error) {
        console.log("error:", error)
        return { success: true }
    }
}


export const GetAvatarAction = async (user: string) => {
    try {
        let res = await axios.get(`${url}/avatar/${user}`)
        return { success: true, data: res.data }
    } catch (error) {
        console.log("error:", error)
        return { success: true, data: [] }
    }
}


export const GetUSAPrices = async () => {
    try {
        let res = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/0x960a69e979d2f507e80121f41d984ea8ad83cd76`)
        return res.data
    } catch (error) {
        console.log("error:", error)
        return null;
    }
}


export const GetTotalSupply = async () => {
    try {
        let res = await axios.get(`https://cknvh68seb.execute-api.us-east-1.amazonaws.com/api/lfg-cmc-info`)
        return res.data
    } catch (error) {
        console.log("error:", error)
        return null;
    }
}