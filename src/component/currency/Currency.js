import React, { Component } from 'react';
import styledComponents from 'styled-components';
import { store } from '../..';
import actions from '../../redux-actions';


const StyledCurrency = styledComponents.div`
    margin-right: 20px;
    position: relative;
    & > p{
        cursor: pointer;
    }
    ul{
        position: absolute;
        right: 0;
        width: 150px;
        height: 0;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
        z-index: 2;

        li{
            padding: 10px 0;
            padding-left: 20px;
            cursor: pointer;
            span{
                margin: 0 5px;
            }
            &:hover{
                color: ${({ theme }) => theme.colors.primary};
            }
        }
        
    }
`;

const Overlay = styledComponents.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1
`;

class Currency extends Component {
    state = {
        currencySwitchOpen: false,
    }

    componentDidMount() {
        this.setState({
            currencies: store.getState().currencies
        });
        this.setState({
            currentCurrency: store.getState().currentCurrency
        });
    }

    handleClick = (action, currency = null) => {
        if (action === "openCloseSwitcher" && currency === null) {
            this.setState({ currencySwitchOpen: !this.state.currencySwitchOpen });
        } else if (action === "switchCurrency") {
            this.setState({ currencySwitchOpen: !this.state.currencySwitchOpen });
            store.dispatch(actions.changeCurrentCurrency(currency));
            localStorage.setItem('currentCurrency', JSON.stringify(currency));
            this.props.changeCurrency();
        }
    }
    render() {
        const currentCurrency = store.getState().currentCurrency;
        const currencies = store.getState().currencies;
        return (
            <div>
                <StyledCurrency>
                    <p onClick={() => this.handleClick("openCloseSwitcher")}>
                        {currentCurrency.symbol == undefined ? "$" : currentCurrency.symbol} {this.state.currencySwitchOpen ? <span>&and;</span> : <span>&or;</span>}
                    </p>
                    <ul style={this.state.currencySwitchOpen ? { height: "auto", top: 40 } : { height: 0, bottom: 0 }}>
                        {currencies.map(currency => (
                            <li key={currency.id} onClick={() => { this.handleClick("switchCurrency", currency) }}><p>{currency.symbol} <span></span> {currency.label}</p></li>
                        ))}
                    </ul>
                </StyledCurrency>
                <Overlay style={this.state.currencySwitchOpen ? { display: "block" } : { display: "none" }} onClick={() => this.handleClick("openCloseSwitcher")}></Overlay>
            </div>
        );
    }
}

export default Currency;