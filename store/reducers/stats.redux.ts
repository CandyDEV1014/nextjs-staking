

const initialState: any = {
    stats: []
};

export const statReducer = (state = initialState, action: any): any => {
    switch (action.type) {
        case 'SAVE_STATS':

            return { ...state, stats: action.payload };
        case 'EMPTY_STATS':

            return { ...state, stats: [] };
        default:
            return state;
    }
};
