import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';

import { database } from "../../api/firebase";  
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from "../../store/application/useApplicationStore"; 
import Button from "../../components/fragments/Button";

const ResultPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { pretenderUser } = useApplicationStore()
    
    const [gameInfo, setGameInfo] = useState()
    const [connectedUser, setConnectedUsers] = useState([])
    const [popUp, setPopUp] = useState(false)

    useEffect(() => {
        let usersArray = []
        let usersVotedArray = []
        onValue(ref(database, `pretenderGame/gameInfo/`), snapshot => {
            setGameInfo(snapshot.val())
            Object.entries(snapshot.val().players).map( x => {
                usersArray.push(x[1])

                if(x[1].voted) {
                    usersVotedArray.push(x[1])
                    if(usersVotedArray.length === usersArray.length) setTimeout(() => { applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderResultPage' }) }, 5000)
                }
            })
            usersArray.sort(({votes:a}, {votes:b}) => b-a) //sort array of objects by value in object 
            setConnectedUsers(usersArray)
            usersArray = [] // mora se isprazni, ne secam se vise zbog cega
        })
    }, [])

    const endGameHandler = event => {
        event.preventDefault()

        set(ref(database, `pretenderGame/gameInfo/`), {
            admin: 'test',
            allPresented: false,
            allVoted: false,
            durationOfRound: 30,
            durationOfPresentation: 30,
            gameCode: '',
            roundsPlayed: 1,
            started: false,
            topic: '',
            selectedWord: '',
            usersConnected: 0,
            newRound: false,
            endGame: true,
        })

        applicationDispatch({ type: 'reset-defaults', payload: {
            masterData: false,
            userData: false,
            logged: false,
            page: 'login',
            pretenderPage: 'pretenderGameSetup',
            pretenderUser: null,
            selectedGame: '',
            selectedTopic: '',
            selectedWord: '',
            gameDuration: '',
            presentationDuration: '',
            game: {
                name: '',
                topic: []
            },
            gameCode: null,
            topic: {},
            editTopic: { 
                name: '',
                topic: []
            },
        }})

        // window.location.href='http://localhost:3001/admin-setup-page'
        window.location.href='https://ubiquitous-alpaca-9d3e24.netlify.app/admin-setup-page'
    }

    const newRoundHandler = event => {
        event.preventDefault()
        let wasPretender = []

        setPopUp(true)

        get(child(ref(database), `pretenderGame/gameInfo/players/`)).then((snapshot) => {

            Object.entries(snapshot.val()).map(user => { if(!user[1].pretender) wasPretender.push(user[1]) })

            if(wasPretender.length === 0) {
                setPopUp(false)
                window.alert('All users was pretenders!')
            } else {
                set(ref(database, `pretenderGame/gameInfo/`), {
                    ...gameInfo,
                    allPresented: false,
                    allVoted: false,
                    durationOfRound: 30,
                    durationOfPresentation: 30,
                    roundsPlayed: gameInfo.roundsPlayed + 1,
                    started: false,
                    topic: '',
                    selectedWord: '',
                    newRound: true,
                    endGame: false
                })

                get(child(ref(database), `pretenderGame/gameInfo/players/`)).then((snapshot) => {
                    Object.entries(snapshot.val()).map( user => {
                        set(ref(database, `pretenderGame/gameInfo/players/${user[1].playerURL}/`), {
                            ...user[1],
                            addedWord: false,
                            finishPresenting: false,
                            inputText: '',
                            voted: false,
                            isPretender: false
                        })
                    })
                })
                setTimeout(() => { applicationDispatch({ type: 'set-page', payload: 'gameSelection' }) }, 10000)
            }
        })

        
        

    }

    return (
        <Container>
            {popUp && 
                <PopUpPage>
                    <Text fontSize='56px' color="white">Please wait ...</Text>
                </PopUpPage>
            }
            <TopElement>
                <TextWrapper>
                    <Text fontSize='36px' fontWeight='bold'>Who`s pretending</Text>
                    <Text fontSize='22px'>Round {gameInfo?.roundsPlayed} - Discusion</Text>
                </TextWrapper>
                <ButtonWrapper>
                    <Button margin='0 25px 0 0' color='red' label='END GAME' onClick={endGameHandler} />
                    <Button color='blue' label='NEXT ROUND' onClick={newRoundHandler} />
                </ButtonWrapper>
            </TopElement>
            <TopicName>
                <Text fontSize='22px' color="white">{gameInfo?.topic}</Text>
            </TopicName>
            <table style={{ borderCollapse: 'collapse'}}>
                <PlayersTable>
                    <PlayersTableTR>
                        {connectedUser.map( user => { return (
                            <PlayersTableTD key={uuidv4()}>
                                <Text fontSize='22px'>{user.name}</Text>
                                {user.isPretender && <Text fontSize='22px'>pretender</Text>}
                                {user.voted && <Text fontSize='22px'>VOTED</Text>}                                
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
const PopUpPage = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000f5;
    position: absolute;
    z-index: 1;
`
const TextWrapper = styled.div`

`
const ButtonWrapper = styled.div`
    display: flex;
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
const TopElement = styled.div`
    width: 750px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export default ResultPage