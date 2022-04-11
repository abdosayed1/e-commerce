import React, { Component } from 'react';
import styled from "styled-components";
import { Container } from "../../styles/Container.styled"
import NavList from './NavList';
import CartOverlayButton from '../cart-overlay/CartOverlayButton';
import Currency from '../currency/Currency';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import { withTheme } from 'styled-components';

const StyledNav = styled.nav`
    width: 100%;
    position: relative;
    height: 80px;

    & > a{
        position: absolute;
        left: calc(50% - 41px/2);
        top: calc(50% - 41px/2);
        height: 41px;
        width: 41px;
        z-index: 9999999;
    }

    & > div,
    & .action-list{
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @media screen and (max-width: 1065px){
        height: auto;
        & > a{
            position: relative;
            display: block;
            width: 100%;
            left: 0;
            top: 0;
            text-align: center;
            margin-top: 10px;
        }
        & > div{
            width: 80%;
        }
    }

    @media screen and (max-width: ${({ theme }) => theme.screens.mobile}){
        & > div{
            flex-direction: column;
            justify-content: center;
            height: auto;
        }
    }
`;

class Navbar extends Component {
    state = {}
    render() {
        return (
            <StyledNav>
                <Link to={`/`}>
                    <img src={logo} alt="Logo" />
                </Link>
                <Container style={{ position: "relative" }}>
                    <NavList />
                    <div>
                    </div>
                    <div className='action-list'>
                        <Currency changeCurrency={this.props.changeCurrency} />
                        <CartOverlayButton />
                    </div>
                </Container>
            </StyledNav>
        );
    }
}

export default withTheme(Navbar);