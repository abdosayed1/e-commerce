import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { store } from '../..';
import actions from '../../redux-actions';


const StyledCart = styled.div`
    background-color: #fff;
    padding: 50px;
    h3{
        font-size: 2rem;
        margin: 20px 0;
        text-transform: uppercase;
    }
    .products-container{
        .product{
            display: flex;
            flex-wrap: wrap;
            height: 230px;
            align-items: center;
            padding-bottom: 10px;
            margin-bottom: 10px;
            position: relative;

            
            .content{
                width: 75%;
                height: 100%;
                h3{
                    font-size: 1.2rem;
                    font-weight: 100;
                    text-transform: capitalize;
                    margin-bottom: 10px;
                }
                h4, h5{
                    margin-bottom: 10px;
                }
                h5.quantity{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }
                h5 span{
                    padding: 10px;
                    border: 1px solid #000;
                }
                ul.attr{
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    li{
                        padding: 10px;
                        border: 1px solid #000;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
                }
                h6{
                    width: 100%;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #fff;
                    background-color: #000;
                    text-align: center;
                    padding: 10px 0;
                    margin-top: 10px;
                    text-transform: capitalize;
                    cursor: pointer;
                }
            }
            .img{
                width: 25%;
                height: 100%;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
            }
        }
    }

    .cost-checkout{
        height: 100px;
        h4{
            padding-left: 10px;
            font-size: 1.5rem;
        }
        .actions{
            display: flex;
            justify-content: space-between;
            height: 100%;
            text-transform: uppercase;
            margin-top: 10px;
            & > div{
                display: block;
                width: 100%;
                padding: 20px 0;
                text-align: center;
                text-decoration: none;
            }
            .cartPage{
                border: 1px solid #000;
                color: #000;
            }
            .checkout{
                background-color: ${({ theme }) => theme.colors.primary};
                color: #fff;
            }
        }
    }
`;

class Cart extends Component {
    state = {
        cart: [],
        cartCount: 0
    }

    componentDidMount() {
        this.setState({
            cart: store.getState().cart,
            cartCount: store.getState().cartCount
        });
    }

    getPrice = (prices, currentCurrency) => {
        // console.log(prices);
        let price = prices.find(price => {
            return price.currency.symbol == currentCurrency.symbol;
        });

        return <span>{price.currency.symbol}{price.amount}</span>
    }

    getAttrElement = (attr) => {
        if (attr.value.startsWith("#")) {
            return <li key={attr.id} style={{ backgroundColor: attr.value, width: "50px", height: "50px" }}></li>
        } else {
            return (
                <li key={attr.id}>
                    {attr.value}
                </li>
            )
        }
    }

    removeItem = (product) => {
        const { cart } = this.state;
        const filteredCart = cart.filter(item => item !== product);
        this.setState({ cart: filteredCart });
        store.dispatch(actions.changeCart(filteredCart));
        localStorage.setItem('cart', JSON.stringify(filteredCart));
        store.dispatch(actions.changeCartCount(filteredCart.length));
        this.props.refreshNavbar();
    }

    getTotalCost = () => {
        const { cart } = this.state;
        const currentCurrency = store.getState().currentCurrency;
        let costsArray = [];
        let totalCost = 0;

        cart.map(prod => {
            let prices = prod.product.prices.find(price => {
                return price.currency.symbol == currentCurrency.symbol
            });
            costsArray.push(prices.amount * prod.quantity);
        })

        for (let i = 0; i < costsArray.length; i++) {
            totalCost += costsArray[i];
        }

        return (
            <div>
                <h3>total cost:</h3>
                <h4 className='totalCost'>{currentCurrency.symbol + (Math.round(totalCost * 100) / 100)}</h4>
                <div className='actions'>
                    <div className='checkout' onClick={this.resetApp}>check out</div>
                </div>
            </div>
        )

    }

    resetApp = () => {
        localStorage.clear();
        this.props.history.push('/');
        this.props.resetApp();
    }

    handleChangeItemQuantity = (action, product) => {
        if (action === "add") {
            const myProduct = { ...product, quantity: product.quantity + 1 };
            const myNewState = this.state.cart.map(item => item === product ? myProduct : item);

            this.setState({ cart: myNewState });

        } else if (action === "remove" && product.quantity > 1) {
            const myProduct = { ...product, quantity: product.quantity - 1 };
            const myNewState = this.state.cart.map(item => item === product ? myProduct : item);

            this.setState({ cart: myNewState });
        }
    }

    render() {
        const { cart } = this.state;
        const currentCurrency = store.getState().currentCurrency;

        return (
            <StyledCart>
                <h3>cart</h3>
                <div className='products-container'>
                    {
                        cart.length > 0 ?
                            cart.map((product, i) => (
                                <div className='product' key={product.product.id + i}>
                                    <div className='content'>
                                        <h3>{product.product.brand}<br />{product.product.name}</h3>
                                        <h4>{this.getPrice(product.product.prices, currentCurrency)}</h4>
                                        <h5 className='quantity'><span onClick={() => this.handleChangeItemQuantity("add", product)}>+</span> {product.quantity} <span onClick={() => this.handleChangeItemQuantity("remove", product)}>-</span></h5>
                                        <ul className='attr'>
                                            {
                                                product.attr.length > 0 ?
                                                    product.attr.map((attr) => { return this.getAttrElement(attr) }
                                                    )
                                                    :
                                                    <li><p>there is no attributes in this product</p></li>
                                            }
                                        </ul>
                                        <h6 onClick={() => this.removeItem(product)}>remove</h6>
                                    </div>
                                    <div className='img' style={{ backgroundImage: `url(${product.product.gallery[0]})` }}></div>
                                </div>
                            ))
                            :
                            <div className='empty'>no item left go to shop <Link to='/'>here</Link></div>
                    }
                </div>

                <div className='cost-checkout'>
                    {
                        cart.length > 0 ?
                            this.getTotalCost()
                            :
                            ""
                    }
                </div>
            </StyledCart>
        );
    }
}

export default withRouter(Cart);