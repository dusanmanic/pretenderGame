import React from "react";
import styled from 'styled-components'

import Spiner from '../../assets/spiner.svg'

const Button = ({
    id,
    ref,
    onClick,
    label,
    margin,
    disabled,
    spiner,
    color,
    type
}) => {

    return (
        <Wrapper margin={margin}>
            {spiner ? 
                <SpinerImage src={Spiner} />
                :
                <StyledButton
                    type={type}
                    color={color}
                    id={id}
                    ref={ref}
                    onClick={disabled ? null : onClick}
                    disabled={disabled}
                >
                    {label}
                </StyledButton>}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    height: 45px;
    margin: ${props => props.margin};
`
const StyledButton = styled.button`
    height: 45px;
    background-color: ${props => props.disabled ? 'gray' : props.color};
    color: #ffffff;
    border-radius: 5px;
    padding: 0 15px 0 15px;
    border: none;
    cursor: pointer;
    align-self: flex-start;
    white-space: nowrap;

    &:active {
        background-color: ${props => props.disabled ? 'gray' : 'darkBlue'};
    }
`
const SpinerImage = styled.img`
    height: 45px;    
`

export default Button