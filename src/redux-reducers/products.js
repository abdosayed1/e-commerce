const prodsReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_PRODUCTS':
            return state = action.prods;
        default:
            return state;
    }
}

export default prodsReducer;