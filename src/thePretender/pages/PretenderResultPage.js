import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';

import { database } from '../../api/firebase';  
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from "../../store/application/useApplicationStore";

const PretenderResultPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { pretenderUser } = useApplicationStore()
    
    const [gameInfo, setGameInfo] = useState()
    const [connectedUser, setConnectedUsers] = useState([])

    useEffect(() => {
        let usersArray = []
        onValue(ref(database, `pretenderGame/gameInfo/`), snapshot => {
            if(snapshot.val().endGame) window.location.href='https://ubiquitous-alpaca-9d3e24.netlify.app/'
            // if(snapshot.val().endGame) window.location.href='http://localhost:3000/'

            setGameInfo(snapshot.val())
            if(snapshot.val().newRound) applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderGameLoading' })

            Object.entries(snapshot.val().players).map( x => {
                usersArray.push(x[1])
                if(x[1].id === pretenderUser.id) applicationDispatch({ type: 'set-pretender-user', payload: x[1] })
            })          

            usersArray.sort(({votes:a}, {votes:b}) => b-a) //sort array of objects by value in object 
            setConnectedUsers(usersArray)
            usersArray = [] // mora se isprazni, ne secam se vise zbog cega
        })
    }, [])

    return (
        <Container>
            <React.Fragment>
                <Text fontSize='36px' fontWeight='bold'>The Pretender</Text>
                <Text fontSize='22px'>Round {gameInfo?.roundsPlayed} - Discusion</Text>
            </React.Fragment>
            <TopicName>
                <Text fontSize='22px' color="white">{gameInfo?.topic}</Text>
            </TopicName>
            <table style={{ borderCollapse: 'collapse'}}>
                <PlayersTable>
                    <PlayersTableTR>
                        {connectedUser.map( user => { return (
                            <PlayersTableTD key={uuidv4()}>
                                <Text fontSize='22px'>{user.name}</Text>
                            </PlayersTableTD>
                        ) })}
                    </PlayersTableTR>
                    <PlayersTableTR>
                        {connectedUser.map( user => {
                            return (
                            <PlayersTableTD key={uuidv4()}>
                                <Text fontSize='22px'>{user.inputText}</Text>
                                <Text fontSize='22px'>{user.votes} PT</Text> 
                            </PlayersTableTD>
                            ) })}
                    </PlayersTableTR>
                </PlayersTable>
            </table>
        </Container>
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Text = styled.span`
    display: ${props => props.display ? props.display : 'block'};
    position: ${props => props.position && props.position};
    right: ${props => props.right && props.right};
    top: ${props => props.top && props.top};
    text-align: ${props => props.textAlign && props.textAlign};
    z-index: 1;
    font-weight: ${props => props.fontWeight && props.fontWeight};
    font-size: ${props => props.fontSize && props.fontSize};
    color: ${props => props.color && props.color};
    margin: ${props => props.margin};
    white-space: pre-wrap;    
    padding: ${props => props.padding && props.padding}
`
const PlayersTable = styled.tbody`
    width: 80vw;
    display: flex;
    border: 1px solid black;
`
const PlayersTableTR = styled.tr`
    width: 40vw;
    display: flex;
    flex-direction: column;
`
const PlayersTableTD = styled.td`
    height: 55px;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px 0 25px; 
`
const TopicName = styled.div`
    width: 850px;
    height: 50px;
    background-color: blue;
    margin: 55px 0;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
`
export default PretenderResultPage