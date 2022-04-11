function getLocalStorageData(field) {
    switch (field) {
        case 'categories':
            return localStorage.getItem('categories') !== null ? JSON.parse(localStorage.getItem('categories')) : [];
        case 'currentCat':
            return localStorage.getItem('currentCategory') !== null ? localStorage.getItem('currentCategory') : "";
        case 'currentCurrency':
            return localStorage.getItem('currentCurrency') !== null ? JSON.parse(localStorage.getItem('currentCurrency')) : "";
        case 'cart':
            return localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : [];
        case 'cartCount':
            return localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')).length : 0;

    }
}

const initState = {
    categories: getLocalStorageData('categories'),
    currentCat: getLocalStorageData('currentCat'),
    products: [],
    currentProduct: {},
    currencies: [],
    currentCurrency: getLocalStorageData('currentCurrency'),
    cart: getLocalStorageData('cart'),
    cartCount: getLocalStorageData('cartCount'),
}


export default initState;