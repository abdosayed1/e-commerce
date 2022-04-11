import React, { Component } from 'react';
import GlobalStyles from './styles/Global';
import Navbar from './component/navbar/Navbar'
import Category from './views/category/Category'
import { ThemeProvider } from 'styled-components';
import { gql } from '@apollo/client';
import { client, store } from '.';
import actions from './redux-actions';
import Product from './views/product/Product';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cart from './views/cart/Cart';
import { withRouter } from 'react-router-dom';

const theme = {
    colors: {
        primary: "#5ECE7B"
    },
    screens: {
        mobile: '768px',
        tablet: '1024px',
    }
}

class App extends Component {
    state = {
        currencyChange: false
    }

    componentDidMount() {



        const CATEGORIES = gql`
            {
                categories{
                    name
                }
            }
        `;

        // store categories and products data in redux state
        client.query({
            query: CATEGORIES,
        }).then(response => {
            const categoriesData = response.data.categories.map((cat, index) => {
                let op = {
                    id: index,
                    name: cat.name
                }

                return op;
            });


            // get init categories
            store.dispatch(actions.getCats(categoriesData));
            localStorage.setItem("categories", JSON.stringify(categoriesData));
            if (store.getState().currentCat === "") {
                store.dispatch(actions.changeCat(store.getState().categories[0].name));
            }

            return store.getState().currentCat;
        }).then(currCat => {
            const PRODUCTS = gql`
                {
                    category(input: {title: "${currCat}"}){
                        products{
                            id
                            name
                            inStock
                            gallery
                            attributes{
                                id
                                name
                            }
                            prices{
                                currency{
                                    label
                                    symbol
                                }
                                amount
                            }
                        }
                    }
                }
            `;

            client.query({
                query: PRODUCTS,
            }).then(res => {
                const productsData = res.data.category.products.map(product => {
                    let op = {
                        id: product.id,
                        name: product.name,
                        inStock: product.inStock,
                        gallery: product.gallery,
                        prices: product.prices,
                        attributes: product.attributes
                    }

                    return op;
                })

                store.dispatch(actions.changeProds(productsData));
            })
        });

        // store currencies and currentCurrency(init) data in redux state
        const CURRENCIES = gql`
            {
                currencies{
                    label
                    symbol
                }
            }
        `;

        client.query({ query: CURRENCIES })
            .then(res => {
                const currenciesData = res.data.currencies.map((currency, index) => {
                    let op = {
                        id: index,
                        label: currency.label,
                        symbol: currency.symbol
                    }
                    return op;
                })

                store.dispatch(actions.getCurrencies(currenciesData));
                if (store.getState().currentCurrency === "") {
                    store.dispatch(actions.changeCurrentCurrency(store.getState().currencies[0]));
                    localStorage.setItem("currentCurrency", JSON.stringify(store.getState().currencies[0]));
                }

            })
    }

    changeCurrency = () => {
        this.setState({ currencyChange: !this.state.currencyChange });
    }

    refreshNavbar = () => {
        this.childRef.current.forceUpdate();
    }
    childRef = React.createRef();

    resetApp = () => {
        window.location.reload();
    }

    render() {
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <GlobalStyles />
                    <BrowserRouter>
                        <Navbar changeCurrency={this.changeCurrency} ref={this.childRef} />
                        <Switch>
                            <Route path='/' exact component={Category} />
                            <Route path='/product/:product_id' exact>
                                <Product refreshNavbar={this.refreshNavbar} />
                            </Route>
                            <Route path='/cart' exact>
                                <Cart refreshNavbar={this.refreshNavbar} resetApp={this.resetApp} />
                            </Route>
                        </Switch>
                    </BrowserRouter>
                </ThemeProvider>
            </div>
        );
    }
}

export default App;