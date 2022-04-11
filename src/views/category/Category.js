import { gql } from '@apollo/client';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import { client, store } from '../..';
import actions from '../../redux-actions';
import { Container } from '../../styles/Container.styled';
import whiteCart from '../../images/cart_white.png'

const StyledCategories = styled.div`
    h2{
        margin: 80px 0;
        font-size: 3rem;
        font-weight: 100;
        text-transform: capitalize;
        ul{
            font-size: .8rem;
            display: flex;
            margin-top: 10px;
            li{
                margin-right: 20px;
                cursor: pointer;
            }
        }
    }
`;

const ProductsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    &:after {
        content: "";
        flex: auto;
    }
    .overlay{
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
    .card:last-of-type{
        margin-left: 2%
    }
    .card{
        width: 32%;
        padding: 20px;
        background-color: #fff;
        margin: 40px 0;
        position: relative;

        .out-of-stock{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.1);
            font-size: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
            text-transform: uppercase;
            color: #999;
            font-weight: 100;
        }

        .card-img{
            width: 100%;
            height: 300px;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            margin-bottom: 20px;
        }
        .add-to-cart{
            width: 40px;
            height: 40px;
            background-color: ${({ theme }) => theme.colors.primary};
            background-image: url(${whiteCart});
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 50%;
            position: absolute;
            top: 300px;
            right: 40px;
            cursor: pointer;
            :hover{
                background-color: #45b963;
            }
        }
        .card-content{
            h3{
                font-weight: 100;
                margin-bottom: 10px;
                a{
                    text-decoration: none;
                    color: #000
                }
            }
            p{
                font-weight: bold;
            }
        }

        &:hover{
            box-shadow: 0px 4px 35px 0px rgba(168, 172, 176, 0.19);
        }
    }

    @media screen and (max-width: ${({ theme }) => theme.screens.tablet}){
        .card{
            width: 48%;
        }
    }

    @media screen and (max-width: ${({ theme }) => theme.screens.mobile}){
        .card{
            width: 100%;
        }
    }
`;

class Category extends Component {
    state = {
        categories: [],
        currentCategory: {
            id: 0,
            name: "??"
        },
        currentCurrency: {
            id: 0,
            label: "??",
            symbol: "??"
        },
        productImageContainer: null
    }

    handleClick = async (cat) => {

        const PRODUCTS = gql`
            {
                category(input: {title: "${cat.name}"}){
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

        await client.query({
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

        store.dispatch(actions.changeCat(cat.name));
        localStorage.setItem('currentCategory', cat.name);
        this.setState({ currentCategory: cat });

        // document.getElementById("products-overlay").style.display = "flex";
    }

    getPrice = (prices, currentCurrency) => {
        // console.log(prices);
        let price = prices.find(price => {
            return price.currency.symbol == currentCurrency.symbol;
        });

        return <span>{price.currency.symbol}{price.amount}</span>
    }

    loadData = () => {
        this.setState({ categories: store.getState().categories });

        document.getElementById("products-overlay").style.display = "none";
    }

    getCardImgStyle = (product) => {
        return { backgroundImage: `url(${product.gallery[0]})` }
    }



    render() {
        const activeLink = {
            color: `${this.props.theme.colors.primary}`
        }
        const currentCategory = store.getState().currentCat === "" ? "all" : store.getState().currentCat;
        const categories = store.getState().categories;
        const products = store.getState().products;
        const currentCurrency = store.getState().currentCurrency;
        return (
            <StyledCategories>
                <Container>
                    <h2>
                        category {currentCategory}:
                        <ul>
                            {categories.map(cat => {
                                return (
                                    <li
                                        style={cat.name == currentCategory ? activeLink : {}}
                                        key={cat.id}
                                        onClick={() => this.handleClick(cat)}
                                    >
                                        {cat.name}
                                    </li>
                                )
                            })}
                        </ul>
                    </h2>
                    <ProductsGrid style={categories.length === 0 ? { height: "50vh" } : {}}>
                        <div id='products-overlay' className='overlay' onMouseMove={this.loadData}><p>loading... <br /><br /> if it took too long to load data just click here</p></div>
                        {
                            products.map(product => (
                                <div key={product.id} className='card'>
                                    <div className='out-of-stock' style={product.inStock ? { display: "none" } : {}}><p>out of stock</p></div>
                                    <div className='card-img' style={this.getCardImgStyle(product)}></div>
                                    <Link to={`product/${product.id}`} className='add-to-cart' style={!product.inStock ? { display: "none" } : {}}></Link>
                                    <div className='card-content'>
                                        <h3><Link to={`product/${product.id}`}>{product.name}</Link></h3>
                                        <p>{this.getPrice(product.prices, currentCurrency)}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </ProductsGrid>
                </Container>
            </StyledCategories>
        );
    }
}

export default withTheme(Category);