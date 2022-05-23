

export const saveStatsAction = (payload: any) => (dispatch: any) => {
    console.log("payload:-=-=-=", payload)
    return dispatch({
        type: 'SAVE_STATS',
        payload
    })
}

export const emptyStatsAction = (payload: any) => (dispatch: any) => {
    console.log("payload:-=-=-=", payload)
    return dispatch({
        type: 'EMPTY_STATS',
        payload
    })
}


