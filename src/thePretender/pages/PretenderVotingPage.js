import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';

import { database } from '../../api/firebase';  
import { ref, set, child, get, onValue } from "firebase/database";

import ImgBtn from '../../assets/imgBtn.png'

import { useApplicationStore, useApplicationDispatch } from "../../store/application/useApplicationStore";

const PretenderVotingPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { pretenderUser } = useApplicationStore()

    const [connectedUser, setConnectedUsers] = useState([])

    useEffect(() => {
        let usersArray = []
        let usersVotedArray = []
        onValue(ref(database, `pretenderGame/gameInfo/`), snapshot => {
            Object.entries(snapshot.val().players).map( x => {
                usersArray.push(x[1])
                if(x[1].id === pretenderUser.id) applicationDispatch({ type: 'set-pretender-user', payload: x[1] })

                if(x[1].voted) {
                    usersVotedArray.push(x[1])
                    
                    if(usersVotedArray.length === snapshot.val().usersConnected) {
                        setTimeout(() => { applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderResultPage' }) }, 5000)
                    }
                }
            })
            setConnectedUsers(usersArray)
            usersArray = [] // mora se isprazni, ako se ne prazni duplira se
            usersVotedArray = []
        })
    }, [])

    const voteHandler = event => {
        event.preventDefault()
        connectedUser.map( user => {
            if(user.id === pretenderUser.id) set(ref(database, `pretenderGame/gameInfo/players/${user.playerURL}/voted`), true)
            if(user.id === event.target.getAttribute('data-id')) set(ref(database, `pretenderGame/gameInfo/players/${user.playerURL}/votes`), user.votes + 1)
        })
    }

    return (
        <Container>
            <React.Fragment>
                <Text fontSize='36px' fontWeight='bold'>The Pretender</Text>
                <Text fontSize='22px'>Round 1 - Discusion</Text>
            </React.Fragment>
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
                                <RightSide>
                                    {user.id === pretenderUser.id ? 
                                        <Text>That`s me</Text>
                                        :
                                        <StyledImg disabled={pretenderUser.voted} data-id={user.id} src={ImgBtn} onClick={voteHandler} />
                                    }                                    
                                </RightSide>
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
const StyledImg = styled.img`
    height: 45px;
    cursor: pointer;
    ${props => props.disabled &&`
        opacity: 0.2;
        pointer-events: none;
    `}
`
const RightSide = styled.div`

`
export default PretenderVotingPage