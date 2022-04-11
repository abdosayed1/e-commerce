const currencyReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CURRENT_CURRENCY':
            return state = action.currency;
        default:
            return state;
    }
}

export default currencyReducer;