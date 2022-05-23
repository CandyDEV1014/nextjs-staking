

const initialState: any = {
  lp_token: null,
  depositAmount: '',
  userAddress: '',
  stakedAmount: ''
};

export const tokenReducer = (state = initialState, action: any): any => {
  switch (action.type) {
    case 'SAVE_TOKEN':

      return { ...state, lp_token: action.payload };
    case 'SAVE_DEPOSIT_AMOUNT':

      return { ...state, depositAmount: action.payload };
    case 'SAVE_USER_ADDRESS':

      return { ...state, userAddress: action.payload };
    case 'SAVE_STAKED_AMOUNT':

      return { ...state, stakedAmount: action.payload };
    default:
      return state;
  }
};
