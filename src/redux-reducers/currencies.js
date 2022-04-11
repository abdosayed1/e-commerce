const currenciesReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CURRENCIES':
            return state = action.currencies;
        default:
            return state;
    }
}

export default currenciesReducer;