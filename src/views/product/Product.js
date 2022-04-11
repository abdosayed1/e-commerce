import styled from "styled-components";
import { Container } from "../../styles/Container.styled";
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { gql } from "@apollo/client";
import { client, store } from "../..";
import { withTheme } from "styled-components";
import actions from "../../redux-actions";
import { Redirect } from "react-router-dom";

const StyledProduct = styled.div`
    margin: 80px 0;
    text-transform: capitalize;
    display: flex;
    height: calc(100vh - 240px);
    align-items: center;
    position: relative;
    .overlay{
        font-weight: 100;
        font-size: 3rem;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        text-align: center;
        z-index: 99999999;
        background-color: #fff;
    }
    .gallery{
        width: 70%;
        height: 100%;
        display: flex;

        .images{
            width: 20%;
            overflow-y: scroll;
            .image{
                width: 100%;
                height: 150px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                margin-bottom: 10px;
                cursor: pointer;
            }
        }

        .current-img{
            width: 80%;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            margin-bottom: 10px;
        }
    }

    .product-details{
        width: 30%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        h2{
            font-size: 2rem;
        }
        h4{
            font-size: 1.8rem;
            font-weight: 100;
        }
        .attr{
            h5{
                font-size: 1.5rem;
            }
            ul{
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                li{
                    border: 1px solid #000;
                    border-radius: 10px;
                    display: inline-block;
                    margin-right: 10px;
                    cursor: pointer;
                    margin-bottom: 10px;
                    transition: all .2s ease-in-out;
                }
            }
            ul.text li{
                padding: 10px;
                :hover,
                &.active{
                    background-color: #000;
                    color: #fff;
                }
            }
            ul.swatch li{
                width: 50px;
                height: 50px;
                :hover,
                &.active{
                    border: 5px solid #333;
                }
            }
        }
        .currency{
            h5{
                font-size: 1.5rem;
            }
            p{
                font-weight: bold;
            }
        }
        .description{
            overflow-y: scroll;
        }
        .amount span{
            padding: 10px;
            border: 1px solid #000;
            border-radius: 5px;
            cursor: pointer;
        }
        .cart-button{
            padding: 15px 0;
            text-align: center;
            text-transform: uppercase;
            background-color: ${({ theme }) => theme.colors.primary};
            color: #fff;
            margin-top: 20px;
            cursor: pointer;
            :hover{
                background-color: #45b963;
            }
        }
    }

    .confirm{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        .msg{
            width: 50%;
            min-width: 300px;
            padding: 20px;
            background-color: #fff;
            h3{
                font-size: 2rem;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            h4{
                font-size: 1.8rem;
                font-weight: 100;
                margin-bottom: 5px;
            }
            h5{
                font-size: 1.2rem;
                font-weight: 100;
                text-transform: capitalize;
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
            .action{
                width: 100%;
                display: flex;
                justify-content: center;
                .confirm-btn{
                    background-color: #45b963;
                }
                .edit{
                    background-color: #ff5656;
                }
                & > p{
                    margin: 10px;
                    padding: 10px 20px;
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
    }

    @media screen and (max-width: ${({ theme }) => theme.screens.tablet}){
        height: auto;
        flex-direction: column;
        margin: 0;
        .gallery{
            width: 100%;
            height: 100vh;
            flex-direction: column-reverse;
            .images{
                width: 100%;
                height: 25%;
                .image{
                    height: 100%;
                    width: 200px;
                    margin-right: 0;
                    display: inline-block;
                }
            }
            .current-img{
                width: 100%;
            }
        }

        .product-details{
            width: 100%;
            display: block;
            h2,
            h4,
            .attr,
            .attr li,
            .amount{
                margin-bottom: 20px;
            }
            .description{
                margin-bottom: 20px;
                overflow: hidden;
            }
            .amount span{
                display: inline-block;
            }
        }
    }
`

class Product extends Component {
    state = {
        product: {},
        currentImg: "",
        productIsLoaded: false,
        productCount: 1,
        checkedAttributes: [],
        confirmDisplayed: false,
        price: ""
    }

    componentDidMount() {
        const productId = this.props.match.params.product_id;

        const PRODUCT = gql`
            {
                product(id: "${productId}"){
                    id
                    name
                    inStock
                    gallery
                    description
                    category
                    brand
                    prices{
                        currency{
                            label
                            symbol
                        }
                        amount
                    }
                    attributes{
                        id
                        name
                        type
                        items{
                            displayValue
                            value
                            id
                        }
                    }
                }
            }
        `;

        client.query({ query: PRODUCT })
            .then((res) => {
                this.setState({ product: res.data.product });
                this.setState({ currentImg: res.data.product.gallery[0] });
                if (res.data.product.attributes.length > 0) {
                    let myAttr = []
                    res.data.product.attributes.map(attr => {
                        myAttr.push(attr.items[0]);
                    })

                    this.setState({ checkedAttributes: myAttr });
                }
                // const currentCurrency = store.getState().currentCurrency;
                // let pricex = res.data.product.prices

                // if (pricex !== undefined) {
                //     console.log(pricex, currentCurrency);
                // } else {
                //     console.log(pricex)
                // }
            });



    }

    loadData = () => {
        this.setState({ productIsLoaded: !this.state.productIsLoaded });

        document.getElementById("products-overlay").style.display = "none";
    }

    handleClick = (action, data = {}) => {
        switch (action) {
            case "changeImage":
                this.setState({ currentImg: data });
                break;
            case "add":
                this.setState({ productCount: this.state.productCount + 1 });
                break;
            case "remove":
                if (this.state.productCount > 1) {
                    this.setState({ productCount: this.state.productCount - 1 });
                }
                break;
            case "showCloseComfirmMsg":
                this.setState({ confirmDisplayed: !this.state.confirmDisplayed });
                break;
            case "addProductToCart":
                const prevCart = store.getState().cart;
                const cartCount = store.getState().cartCount + 1;
                const productPackage = {
                    product: this.state.product,
                    quantity: this.state.productCount,
                    attr: this.state.checkedAttributes,
                    price: this.state.price
                };
                const finalCart = [...prevCart, productPackage];
                store.dispatch(actions.changeCart(finalCart));
                localStorage.setItem('cart', JSON.stringify(finalCart));
                store.dispatch(actions.changeCartCount(cartCount));
                this.props.refreshNavbar();
                this.props.history.push('/')
                break;

        }
    }

    getPrice = (prices, currentCurrency) => {
        let price = prices.find(price => {
            return price.currency.symbol == currentCurrency.symbol;
        });
        if (price === undefined) {
            return <span>please rechoose a currency</span>
        } else {
            return <span>{price.currency.symbol}{price.amount}</span>
        }
    }

    getActiveAttr = (item) => {
        if (this.state.checkedAttributes.length > 0) {
            let x;
            this.state.checkedAttributes.map(attr => {
                if (attr === item) {
                    x = true;
                }
            });
            if (x) {
                return true;
            }
        } else {
            return false;
        }
    }

    changeChechedAttr = (attr, item) => {
        let myAttr;
        this.state.checkedAttributes.map(x => {
            if (attr.items.find(i => i === x) !== undefined) {
                myAttr = attr.items.find(i => i === x)
            }
        })
        let finalState = this.state.checkedAttributes.map(x => {
            if (x === myAttr) {
                return item;
            } else {
                return x;
            }
        })
        this.setState({ checkedAttributes: finalState });
    }

    getAttrElement = (attr, i) => {
        if (attr.value.startsWith("#")) {
            return <li key={attr.id + i} style={{ backgroundColor: attr.value, width: "50px", height: "50px" }}></li>
        } else {
            return (
                <li key={attr.id}>
                    {attr.value}
                </li>
            )
        }
    }

    getTotalCost = () => {
        const currentCurrency = store.getState().currentCurrency;
        let price = this.state.product.prices.find(price => {
            return price.currency.symbol == currentCurrency.symbol;
        });
        if (price === undefined) {
            return <span>$ ???</span>
        } else {

            return <span>{price.currency.symbol}{price.amount * this.state.productCount}</span>
        }
    }

    render() {
        const currentCurrency = store.getState().currentCurrency;
        return (
            <Container>
                <StyledProduct>
                    <div className="confirm" style={this.state.confirmDisplayed ? { display: 'flex' } : { display: 'none' }}>
                        <div className="msg">
                            <h3>Add to the cart?</h3>
                            <h4>{this.state.product.brand} - {this.state.product.name}</h4>
                            <h5>attributes:</h5>
                            <ul className="attr">
                                {
                                    this.state.checkedAttributes.length > 0 ?
                                        this.state.checkedAttributes.map((attr, i) => { return this.getAttrElement(attr, i) }
                                        )
                                        :
                                        <li><p>there is no attributes in this product</p></li>
                                }
                            </ul>
                            <h5>quantity:</h5>
                            <p>{this.state.productCount}</p>
                            <h5>total cost:</h5>
                            {
                                this.state.product.prices !== undefined ?
                                    <p>{this.getTotalCost()}</p>
                                    :
                                    <p>$??</p>
                            }
                            <div className="action">
                                <p className="confirm-btn" onClick={() => this.handleClick("addProductToCart")}>confirm</p>
                                <p className="edit" onClick={() => this.handleClick("showCloseComfirmMsg")}>edit</p>
                            </div>
                        </div>
                    </div>
                    <div id='products-overlay' className='overlay' onMouseMove={this.loadData} style={{ display: "none" }}><p>loading... <br /><br /> if it took too long to load data just click here</p></div>
                    <div className="gallery">
                        <div className="images">
                            {
                                // product === undefined ?
                                //     <div>hello</div>
                                //     :
                                //     product.gallery.map(img => (
                                //         <div className="image" key={img} style={{ bacgroundImg: `url("${img}")` }}></div>
                                //     ))
                                this.state.product.gallery === undefined ?
                                    (<div>hello</div>)
                                    :
                                    this.state.product.gallery.map(img => (
                                        <div className="image" key={img} style={{ backgroundImage: `url("${img}")` }} onClick={() => this.handleClick("changeImage", img)}></div>
                                    ))
                            }
                        </div>
                        <div className="current-img" style={{ backgroundImage: `url("${this.state.currentImg}")` }}></div>
                    </div>
                    <div className="product-details">
                        <h2>{this.state.product.brand}</h2>
                        <h4>{this.state.product.name}</h4>
                        <ul className="attr">
                            {
                                this.state.product.attributes === undefined ?
                                    (<div>hello</div>)
                                    :
                                    this.state.product.attributes.map((attr, i) => (
                                        <li key={attr.id + i}>
                                            <h5>{attr.name}:</h5>
                                            {
                                                attr.type === "text" ?
                                                    (<ul className="text">
                                                        {attr.items.map((item, index) => (
                                                            <li className={this.getActiveAttr(item) ? "active" : ""} key={item.id + "-" + index} onClick={() => this.changeChechedAttr(attr, item)}>
                                                                {item.value}
                                                            </li>
                                                        ))}
                                                    </ul>)
                                                    :
                                                    (<ul className="swatch">
                                                        {attr.items.map((item, ind) => (
                                                            <li className={this.getActiveAttr(item) ? "active" : ""} key={item.id + ind} onClick={() => this.changeChechedAttr(attr, item)} style={{ backgroundColor: item.value }}></li>
                                                        ))}
                                                    </ul>)
                                            }
                                        </li>
                                    ))
                            }
                        </ul>
                        {/* i know this should be my last Resort and it is */}
                        <p className="description" dangerouslySetInnerHTML={{ __html: this.state.product.description }}></p>
                        <p className="amount"><span onClick={() => this.handleClick("add")}>+</span> {this.state.productCount} <span onClick={() => this.handleClick("remove")}>-</span></p>
                        <div className="currency">
                            <h5>Price:</h5>
                            {
                                this.state.product.prices === undefined ?
                                    <p>$??</p>
                                    :
                                    <p>{this.getPrice(this.state.product.prices, currentCurrency)}</p>
                            }
                        </div>
                        <div className="cart-button" onClick={() => this.handleClick("showCloseComfirmMsg")}>add to the cart</div>
                    </div>
                </StyledProduct>
            </Container>
        );
    }
}

export default withTheme(withRouter(Product));