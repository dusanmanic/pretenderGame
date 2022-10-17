import React from "react";
import styled from "styled-components";

import { database } from "../../api/firebase";
import { ref, set, child, get } from "firebase/database";

import LOG_IN from '../../assets/audio/LOG_IN.wav'
import Button from "../../components/fragments/Button";

import { useApplicationDispatch } from '../../store/application/useApplicationStore'

const PretenderGameSetupPage = () => {
    const loginAudio = new Audio(LOG_IN)

    const applicationDispatch = useApplicationDispatch()

    const setPretender = event => {
        event.preventDefault()
        loginAudio.play()

        get(child(ref(database), `pretenderGame/gameInfo/players/`)).then((snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.val()
                let usersArray = []

                Object.entries(data).map((x, y) => usersArray.push(x[1].name))

                if(usersArray.includes(event.target[0].value)) {
                    window.alert('Username already exist, choose another one')
                } else {
                    const pretenderUser = {
                        id: Math.random().toString(36).substring(2),
                        inputText: '',
                        name: event.target[0].value,
                        points: 0,
                        isPretender: false,
                        pretender: false,
                        votes: 0,
                        voted: false,
                        playerURL: `player${Object.entries(data).length + 1}Info`,
                        finishPresenting: false,
                        presenting: false,
                        addedWord: false,
                    }
                    set(ref(database, `pretenderGame/gameInfo/players/player${Object.entries(data).length + 1}Info`), pretenderUser)
                    applicationDispatch({ type: 'set-pretender-user', payload: pretenderUser })
                    applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderGameLoading' })
                }               
            } else {
                const pretenderUser = {
                    id: Math.random().toString(36).substring(2),
                    inputText: '',
                    name: event.target[0].value,
                    points: 0,
                    pretender: false,
                    isPretender: false,
                    votes: 0,
                    voted: false,
                    playerURL: `player1Info`,
                    finishPresenting: false,
                    presenting: false,
                    addedWord: false,
                }
                set(ref(database, `pretenderGame/gameInfo/players/player1Info`), pretenderUser)
                applicationDispatch({ type: 'set-pretender-user', payload: pretenderUser })
                applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderGameLoading' })

            }
        })
    }

    return (
        <PretenderGameSetupPageWrapper>
            <FormWrapper onSubmit={setPretender}>
                <Text>Please enter your nickname for the game:</Text>
                <StyledInput
                    type={'text'}
                    placeholder='Nickname'
                />
                <Button
                    type='submit'
                    color='blue'
                    label='Join game'
                />
            </FormWrapper>
        </PretenderGameSetupPageWrapper>
    )
}

const PretenderGameSetupPageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
`
const FormWrapper = styled.form`
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const Text = styled.span`
    font-size: 16px;
    color: gray;
    white-space: pre-wrap;
`
const StyledInput = styled.input`
    width: 200px;
    height: 40px;
    padding-left: 10px;
    border: 1px solid gray;
    border-radius: 5px
`

export default PretenderGameSetupPage