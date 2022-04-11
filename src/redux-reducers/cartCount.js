const cartCountReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CART_COUNT':
            return state = action.cartCount;
        default:
            return state;
    }
}

export default cartCountReducer;