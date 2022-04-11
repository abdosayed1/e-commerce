const catsReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CATEGORIES':
            return state = action.cats;
        default:
            return state;
    }
}

export default catsReducer;