import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { database } from '../../api/firebase';
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from '../../store/application/useApplicationStore';

const PretenderGameLoadingPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { pretenderUser } = useApplicationStore()

    const [loaded, setLoaded] = useState()

    useEffect(() => {       
        onValue(ref(database, `pretenderGame/gameInfo/started/`), snapshot => {
            if(!snapshot.val()) {
                return setLoaded('Please wait for the game to start . . .')
            } else {
                get(child(ref(database), `pretenderGame/gameInfo/players/${pretenderUser.playerURL}`)).then(snapshot => {
                    if(snapshot.exists()) {
                        const data = snapshot.val()
                        let countdownNumber = 10
                        const countdown = setInterval(() => {
                            countdownNumber-- 
                            if(countdownNumber === 0) {
                                clearInterval(countdown)
                                data.isPretender ? 
                                    applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderUserPage' })
                                :
                                    applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderGamePreparationPhase' })
                            }
                            setLoaded(`Game will start in ${countdownNumber} seconds`)
                        }, 1000)
                        
                    }
                })
            }
        })    
    }, [])

    return (
        <Container>
            <Text>
                {loaded}
            </Text>
        </Container>
    )
}


const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Text = styled.span`
    font-size: 36px;
    color: gray;
    white-space: pre-wrap;
`

export default PretenderGameLoadingPage