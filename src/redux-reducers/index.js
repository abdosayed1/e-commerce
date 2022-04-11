import cartReducer from "./cart";
import cartCountReducer from "./cartCount";
import catsReducer from "./categories";
import catReducer from "./category";
import currenciesReducer from "./currencies";
import currencyReducer from "./currency";
import initState from "./initState";
import productReducer from "./product";
import prodsReducer from "./products";


const allReducers = (state = initState, action) => ({
    categories: catsReducer(state.categories, action),
    currentCat: catReducer(state.currentCat, action),
    products: prodsReducer(state.products, action),
    currencies: currenciesReducer(state.currencies, action),
    currentCurrency: currencyReducer(state.currentCurrency, action),
    currentProduct: productReducer(state.currentProduct, action),
    cart: cartReducer(state.cart, action),
    cartCount: cartCountReducer(state.cartCount, action)
});


export default allReducers;