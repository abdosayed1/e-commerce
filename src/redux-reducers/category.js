const catReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CATEGORY':
            return state = action.newCat;
        default:
            return state;
    }
}

export default catReducer;