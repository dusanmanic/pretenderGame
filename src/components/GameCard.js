import React from "react";
import styled from 'styled-components'

import Button from "./fragments/Button";

import { database } from "../api/firebase";  
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationDispatch } from "../store/application/useApplicationStore";

const GameCard = ({ title, description, image }) => {

    const applicationDispatch = useApplicationDispatch()

    const gameLaunch = () => {
        applicationDispatch({ type: 'set-selected-game', payload: title})
        applicationDispatch({ type: 'set-page', payload: 'gameSetup'})
        set(ref(database, `pretenderGame/gameInfo/newRound/`), false)
        set(ref(database, `pretenderGame/gameInfo/endRound/`), false)

    }

    return (
        <Card description={description}>
            <StyledImage src={image} />
            <Text>{title}</Text>
            <Text dsc>{description}</Text>
            {description &&
                <Button
                    color='blue'
                    onClick={gameLaunch}
                    label='Launch game'
                    margin='auto'
                />
            }
        </Card>
    )
}

const Card = styled.div`
    width: 250px;
    height: ${props => props.description ? '550px' : '250px'};
    margin: 15px;
    border: 1px solid black;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`
const Text = styled.p`
    font-size: ${props => props.dsc ? '18px' : '25px'};
    margin: 0 10px 10px 10px;
`
const StyledImage = styled.img`
    width: 230px;
    margin: 10px 10px 10px 10px
`
export default GameCard