const cartReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CART':
            return state = action.cart;
        default:
            return state;
    }
}

export default cartReducer;