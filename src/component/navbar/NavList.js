import React, { Component } from 'react';
import styledComponents, { withTheme } from "styled-components";

const StyledList = styledComponents.ul`
    display: flex;
    height: 100%;
    align-items: center;

    li{
        padding: 0 20px;
        height: 100%;
        line-height: 80px;
        text-transform: uppercase;
        position: relative;
        cursor: pointer;

        &::after{
            content: '';
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 1px;
            width: 0;
            background-color: ${({ theme }) => theme.colors.primary};
            transition: all .5s ease-in-out;
        }
        &:hover{
            color: ${({ theme }) => theme.colors.primary};
        }

        &:hover::after{
            width: 100%
        }
    }
`;


class NavList extends Component {
    state = {
        links: [
            {
                id: 1,
                text: "women",
                isActive: true
            },
            {
                id: 2,
                text: "men",
                isActive: false
            },
            {
                id: 3,
                text: "kids",
                isActive: false
            }
        ]
    }

    handleClick = (link) => {
        let resultState = this.state.links.map(single => {
            single === link ? single.isActive = true : single.isActive = false;

            return single
        });

        this.setState({ resultState });
    }

    render() {
        const activeLink = {
            color: `${this.props.theme.colors.primary}`,
            borderBottom: `1px solid ${this.props.theme.colors.primary}`
        }
        return (
            <StyledList>
                {this.state.links.map(link => (
                    <li key={link.id} style={link.isActive ? activeLink : {}} onClick={() => this.handleClick(link)}>{link.text}</li>
                ))}
            </StyledList>
        );
    }
}

export default withTheme(NavList);