import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/fragments/Button";
import { v4 as uuidv4 } from 'uuid';

import { database } from "../api/firebase";
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from "../store/application/useApplicationStore";
import Loader from "../components/Loader";
import Check from '../assets/check.png'


const PreparationPhase = () => {
    const applicationDispatch = useApplicationDispatch()

    const [connectedUsers, setConnectedUsers] = useState([])
    const [numberOfConnectedUser, setNumberOfConnectedUser] = useState([])
    const [userAnswering, setUserAnswering] = useState(false)
   
    useEffect(() => {
        let usersArray = []
        let usersFinishPresenting = []
        onValue(ref(database, `pretenderGame/gameInfo/`), snapshot => {
            if(snapshot.val().players) {
                Object.entries(snapshot.val().players).map( x => {
                    usersArray.push(x[1])
    
                    if(x[1].finishPresenting) {
                        usersFinishPresenting.push(x[1])
                        if(usersFinishPresenting.length === snapshot.val().usersConnected) setTimeout(() => {
                            set(ref(database, `pretenderGame/gameInfo/allPresented`), true)
                            applicationDispatch({ type: 'set-page', payload: 'result' })
                        }, 5000)
                    }
                })
                setConnectedUsers(usersArray)               
                // mora se isprazni, ne secam se vise zbog cega
                usersArray = [] 
                usersFinishPresenting = []
            }
        })
    }, [])

    useEffect(() => {
        get(child(ref(database), `pretenderGame/gameInfo/`)).then(snapshot => {
            setNumberOfConnectedUser(Object.entries(snapshot.val().players).length)
        })
    }, [])

    useEffect(() => {
        let usersAnswerArray = []
        let presentationDuration
        let roundDuration
        get(child(ref(database), `pretenderGame/gameInfo/`)).then(snapshot => {
            Object.entries(snapshot.val().players).map(x => { usersAnswerArray.push(x[1]) })
            presentationDuration = snapshot.val().durationOfPresentation * 1000
            roundDuration = snapshot.val().durationOfRound * 1000
        }).then(() => {
            setTimeout(() => {
                const randomUserFromArray = usersAnswerArray[Math.floor(Math.random()*usersAnswerArray.length)]
                setUserAnswering(randomUserFromArray)
                set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}/presenting`), true)
                setTimeout(() => {
                    set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}/finishPresenting`), true)
                    set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}/presenting`), false)
                }, presentationDuration)
                for(let i  = 0; i < usersAnswerArray.length; i++) {
                    if ( usersAnswerArray[i].id === randomUserFromArray.id) {
                        usersAnswerArray.splice(i, 1)
                    }
                    if(usersAnswerArray.length === 0) clearInterval(answerInterval)
                }    
                const answerInterval = setInterval(() => {
                    const randomUserFromArray = usersAnswerArray[Math.floor(Math.random()*usersAnswerArray.length)]
                    setUserAnswering(randomUserFromArray)
                    set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}/presenting`), true)
                    setTimeout(() => {
                        set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}/finishPresenting`), true)
                        set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}/presenting`), false)
                    }, presentationDuration)
                    for(let i  = 0; i < usersAnswerArray.length; i++) {
                        if ( usersAnswerArray[i].id === randomUserFromArray.id) usersAnswerArray.splice(i, 1)
                        if(usersAnswerArray.length === 0) clearInterval(answerInterval)
                    }
                }, presentationDuration)
            }, presentationDuration + 10000)
        })
    }, [])

    return (
        <Container>
            <TitleSection>
                <Text display='block' color='blue'>
                    <a style={{cursor: 'pointer'}} onClick={() => applicationDispatch({ type: 'set-page', payload: 'gameSelection' })}>BACK TO GAME LIST</a>
                </Text>
                <Text display='block' fontSize='45px' >The Pretender</Text>
            </TitleSection>
            <UserWordWrapper>
                <Text display='block' fontSize='24px' margin='20px 0 20px 20px'>{numberOfConnectedUser} users connected</Text>
                <Text display='block' fontSize='24px' margin='20px 0 20px 20px'>entered word / phrase</Text>
            </UserWordWrapper>
            <table style={{ borderCollapse: 'collapse'}}>
                <PlayersTable>
                    <PlayersTableTR>
                        {connectedUsers.map( user => { return (
                            <PlayersTableTD key={uuidv4()}>
                                <Text display='block' fontSize='22px'>{user.name}</Text>
                                {user.isPretender && <Text display='block' fontSize='30px'>pretender</Text>}
                                {(user.pretender && !user.isPretender) &&<Text display='block' fontSize='30px'>was pretender</Text>}
                            </PlayersTableTD>
                        ) })}
                    </PlayersTableTR>
                    <PlayersTableTR>
                        {connectedUsers.map( user => { return (
                            <PlayersTableTD key={uuidv4()}>
                                <Text display='block' fontSize='22px'>{user.inputText}</Text>
                                {user.id === userAnswering.id && !user.finishPresenting && <Text display='block' fontSize='18px'>presenting...</Text>}
                                {user.finishPresenting && <Text display='flex' fontSize='18px'>presented <img src={Check} /></Text> }
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
    align-items: center;
`
const TitleSection = styled.section`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: 75px 0 30px 0;
`
const Text = styled.span`
    display: ${props => props.display};
    align-items: center;
    font-size: ${props => props.fontSize && props.fontSize};
    color: ${props => props.color && props.color};
    margin: ${props => props.margin};
    white-space: pre-wrap;    
    padding: ${props => props.padding && props.padding}
`
const DurationSection = styled.section`
    width: 80vw;
    display: flex;
    justify-content: space-between;
    align-items: center;    
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
const UserWordWrapper = styled.div`
    width: 80vw;
    display: flex;
    justify-content: space-around;
`
const RightSide = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 160px;
`
export default PreparationPhase