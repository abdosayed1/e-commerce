

const getCats = (cats) => {

    return {
        type: 'CHANGE_CATEGORIES',
        cats: cats
    }
}

const changeCat = (cat) => {
    return {
        type: 'CHANGE_CATEGORY',
        newCat: cat
    }
}

const changeProds = (prods) => {
    return {
        type: 'CHANGE_PRODUCTS',
        prods: prods
    }
}

const changeProduct = (product) => {
    return {
        type: 'CHANGE_CURRENT_PRODUCT',
        product: product
    }
}

const getCurrencies = (currencies) => {
    return {
        type: 'CHANGE_CURRENCIES',
        currencies: currencies
    }
}

const changeCurrentCurrency = (currency) => {
    return {
        type: 'CHANGE_CURRENT_CURRENCY',
        currency: currency
    }
}
const changeCart = (cart) => {

    return {
        type: 'CHANGE_CART',
        cart: [...cart]
    }
}
const changeCartCount = (cartCount) => {

    return {
        type: 'CHANGE_CART_COUNT',
        cartCount: cartCount
    }
}

const actions = { getCats, changeCat, changeProds, changeProduct, getCurrencies, changeCurrentCurrency, changeCart, changeCartCount };

export default actions;