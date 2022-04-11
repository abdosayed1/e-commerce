const productReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CURRENT_PRODUCT':
            return state = action.product;
        default:
            return state;
    }
}

export default productReducer;