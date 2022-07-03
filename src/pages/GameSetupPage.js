import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import Button from "../components/fragments/Button";
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid';

import { database } from "../api/firebase";
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from "../store/application/useApplicationStore";

const GameSetupPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { selectedGame, topic, gameCode, selectedTopic, gameDuration, presentationDuration } = useApplicationStore()

    const [connectedUser, setConnectedUsers] = useState([])
    const [numberOfConnectedUser, setNumberOfConnectedUser] = useState([])

    useEffect(() => {     
        let usersArray = []          
        onValue(ref(database, `pretenderGame/gameInfo/players/`), snapshot => {
            if(snapshot.exists()) {
                Object.entries(snapshot.val()).map( x => {
                    usersArray.push(x[1].name)    
                })
                setConnectedUsers(usersArray)
                setNumberOfConnectedUser(Object.entries(snapshot.val()).length)
                usersArray = [] // mora se isprazni, ne secam se vise zbog cega
            } else {
                setNumberOfConnectedUser(0)
            }
        })    
    }, [])

    const selectOnChangeHandler = event => {
        applicationDispatch({ type: 'set-selected-topic', payload: event.value })
        set(ref(database, `pretenderGame/gameInfo/topic`), event.value)
        
    }

    const generateSessionLink = () => {
        const gameCode = uuidv4()
        applicationDispatch({ type: 'set-game-code', payload: gameCode })
        set(ref(database, `pretenderGame/gameInfo/gameCode`), gameCode)
    }

    const copySessionLink = () => {
        navigator.clipboard.writeText(`localhost:3000/${gameCode}`)
        // navigator.clipboard.writeText(`https://ubiquitous-alpaca-9d3e24.netlify.app/${gameCode}`)
    }

    const selectRoundDuration = event => {
        applicationDispatch({ type: 'set-game-duration', payload: event.value })
        set(ref(database, `pretenderGame/gameInfo/durationOfRound`), event.value)
    }

    const selectPresentationDuration = event => {
        applicationDispatch({ type: 'set-presentantion-duration', payload: event.value })
        set(ref(database, `pretenderGame/gameInfo/durationOfPresentation`), event.value)
    }

    const startGame = () => {
        let usersArray = []

        get(child(ref(database), `pretenderGame/gameInfo/players/`))
        .then((snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.val()
                Object.entries(data).map( element => {
                    usersArray.push(element[1])
                })                
            }
        })
        .then(() => {            
            const randomUserFromArray = usersArray[Math.floor(Math.random()*usersArray.length)]
            set(ref(database, `pretenderGame/gameInfo/players/${randomUserFromArray.playerURL}`), { ...randomUserFromArray, pretender: true })
            set(ref(database, `pretenderGame/gameInfo/started`), true)
            set(ref(database, `pretenderGame/gameInfo/usersConnected`), usersArray.length)
            applicationDispatch({ type: 'set-page', payload: 'preparationPhase' })
            usersArray = []
        })      

    }

    return (
        <GameSetupPageWrapper>
            <TitleSection>
                <Text color='blue' >
                    <a onClick={() => applicationDispatch({ type: 'set-page', payload: 'gameSelection' })}>BACK TO GAME LIST</a>
                </Text>
                <Text fontSize='45px' >{selectedGame}</Text>
            </TitleSection>
            <ParticipantSection>
                <Text fontSize='30px' margin='0 0 20px 0' > Participants </Text>
                <ButtonTextHolder>
                    <ButtonWrapper>
                        <Button disabled={gameCode?.length > 0} color='blue' label='GENERATE SESSION LINK' margin='0 20px 0 0' onClick={generateSessionLink} />
                        <Button color='blue' label='COPY SESSION LINK' margin='0 20px 0 0' onClick={copySessionLink} />      
                    </ButtonWrapper>                  
                    <Text>Communicate this session link to all participants. {'\n'}Participants needs this link to join the game</Text>
                </ButtonTextHolder>
                <ConnectedUsersHolder>
                    <Text fontSize='24px' margin='0 0 20px 20px'>{numberOfConnectedUser} users connected</Text>
                    {connectedUser.map(user => {
                        return (
                            <UserButtonWrapper key={uuidv4()}>
                                <Text fontSize='22px' >{user}</Text>
                                <Button color='blue' label='REMOVE' />
                            </UserButtonWrapper>
                        )
                    })}
                </ConnectedUsersHolder>
            </ParticipantSection>
            <ConfigurationSection>
                <Text fontSize='30px' margin='0 0 30px 0' > Configuration </Text>
                <Text fontSize='15px'>Select:</Text>
                <StyledSelect 
                    defaultValue={{label: 'TOPIC', value: 'select topic'}}
                    options={ topic.map( element => { return { label: element, value: element } }) }
                    onChange={selectOnChangeHandler}
                />
                <Text fontSize='15px'>Select:</Text>
                <StyledSelect 
                    defaultValue={{label: 'ROUND TIME', value: 'select time'}}
                    options={[ {label: '30 sec', value: 30}, {label: '45 sec', value: 45} ]}
                    onChange={selectRoundDuration}
                />
                <Text fontSize='15px'>Select:</Text>
                <StyledSelect 
                    defaultValue={{label: 'PRESENTATION TIME', value: 'select time'}}
                    options={[ {label: '30 sec', value: 30}, {label: '45 sec', value: 45}, {label: '60 sec', value: 60} ]}
                    onChange={selectPresentationDuration}
                />
                <Button
                    color='blue' 
                    label='Start game'
                    disabled={!(selectedTopic.length !== 0 && gameDuration.length !== 0 && presentationDuration.length !== 0)}
                    onClick={startGame}
                />
            </ConfigurationSection>
            <TopicsSection>
                <Button
                    color='blue'
                    label='MENAGE TOPIC'
                    onClick={() => applicationDispatch({ type: 'set-page', payload: 'menageTopics' })} 
                />
            </TopicsSection>
        </GameSetupPageWrapper>
    )
}

const GameSetupPageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`
const TitleSection = styled.section`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: 75px 0 30px 0;
`
const ParticipantSection = styled.section`
    width: 45vw;
    height: 650px;
    display: flex;
    flex-direction: column;
`
const ConfigurationSection = styled.section`
    width: 20vw;
    height: 650px;
    display: flex;
    flex-direction: column;
    margin: 0 0 0 15px;
` 
const TopicsSection = styled.section`
    width: 15vw;
    height: 650px;
`
const Text = styled.span`
    display: block;
    font-size: ${props => props.fontSize && props.fontSize};
    color: ${props => props.color && props.color};
    margin: ${props => props.margin};
    white-space: pre-wrap;

    a { cursor: pointer };
`
const ButtonTextHolder = styled.div`
    display: flex;
`
const ButtonWrapper = styled.div`
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const ConnectedUsersHolder = styled.div`
    margin: 50px 0 0 0;
`
const UserButtonWrapper = styled.div`
    width: 450px;
    padding: 10px 10px 10px 10px;
    border: 1px solid gray;
    margin-top: -1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const StyledSelect = styled(Select)`
    width: 25vw;
    margin: 5px 0 15px 0;
`

export default GameSetupPage