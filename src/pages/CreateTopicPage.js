import React, { useState } from "react";
import styled from 'styled-components'

import CreateTopicFields from "../components/CreateTopicFields";
import Button from "../components/fragments/Button";

import { database } from "../api/firebase";
import { ref, set, child, get } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from "../store/application/useApplicationStore";

let gameName = ''
let submitTopic = new Array(16).fill('')

const CreateTopicPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { topic, editTopic} = useApplicationStore()


    const [disableSubmit, setDisableSubmit] = useState(false)
    const [spiner, setSpiner] = useState(false)

    const submitHandler = event => {
        event.preventDefault()        

        for (let i = 0; i <= event.target.length; i++) {
            if(event.target[i]?.id) {                
                if(event.target[i].id.includes('gameName')) {
                    gameName = event.target[i].value
                } else {
                    submitTopic[Number(event.target[i].id)] = event.target[i].value
                } 
            }   
        }
            
        setSpiner(true)
    
        const submitGame = {
            name: gameName,
            topic: submitTopic
        }
        
        get(child(ref(database), `pretenderGame/topics/${gameName}`)).then((snapshot) => {
            if(snapshot.exists() && !editTopic.name) {
                window.alert('You have this name saved in database, please choose another one.')
                setSpiner(false)
            } else {
                set(ref(database, `pretenderGame/topics/` + gameName), { ...submitTopic }).then(() => {
                    get(child(ref(database), `pretenderGame/topics/${gameName}`)).then((snapshot) => {
                        if(snapshot.exists()) {
                            // console.log(snapshot.val());
                            get(child(ref(database), `pretenderGame/topics/`)).then((snapshot) => {
                                if(snapshot.exists()) {
                                    applicationDispatch({ type: 'set-topic', payload: Object.keys(snapshot.val()) })
                                    applicationDispatch({ type: 'set-editing-topic', payload: { name: '', topic: [] } })
                                    setSpiner(false)
                                    applicationDispatch({ type: 'set-page', payload: 'gameSetup' })       
                                    }
                            })
                        } else {
                            console.log("No data available");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                })
            }
        })        

        applicationDispatch({ type: 'set-game', payload: submitGame})
    }

    const cancel = () => {
        applicationDispatch({ type: 'set-editing-topic', payload: { name: '', topic: [] } })
        applicationDispatch({ type: 'set-page', payload: 'menageTopics' })
    }

    return (
        <CreateTopicPageWrapper>
            <Section>
                <StyledForm onSubmit={submitHandler}>
                    <NameButtonWrapper>
                        <TitleSection>
                            <Text 
                                color='blue'
                                pointer
                                onClick={cancel}
                            >
                                CANCEL
                            </Text>
                            <Text fontSize='45px'>CREATE NEW TOPIC</Text>
                        </TitleSection>
                            <StyledInput
                                defaultValue={editTopic.name ? editTopic.name : ''}
                                id='gameName'
                                type='text'
                                autoComplete="off"
                            />                    
                            <Button
                                type='submit'
                                color='blue'
                                margin='115px 0 0 0 '
                                label='SAVE'
                                disabled={disableSubmit}
                                spiner={spiner}
                            />
                    </NameButtonWrapper>
                    <CreateTopicFields defaultValue={editTopic} widthCalc='calc(10px + 80vw)' inputWidth='20vw' />
                </StyledForm>
            </Section>            
        </CreateTopicPageWrapper>
    )
}

const CreateTopicPageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
`
const TitleSection = styled.section`
    display: flex;
    flex-direction: column;
    width: 60vw;
    margin: 75px 0 30px 0;
`
const Text = styled.span`
    font-size: ${props => props.fontSize && props.fontSize};
    color: ${props => props.color && props.color};
    cursor: ${props => props.pointer && 'pointer'};
    margin: ${props => props.margin};
    white-space: pre-wrap;
`
const StyledForm = styled.form`

`
const NameButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`
const StyledInput = styled.input`
    width: 200px;
    height: 40px;
    font-size: 18px;
    padding-left: 10px;
    border: 1px solid gray;
    border-radius: 5px;
    margin: 115px 10px 30px 0;

    &:focus {
        outline: none;
    }
`
const Section = styled.section`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`
export default CreateTopicPage


// Reminder //
// set(ref(database, `pretenderGame/topics/` + gameName), { ...submitTopic }).then( () => {            
//     get(child(ref(database), `pretenderGame/topics/${gameName}`)).then((snapshot) => {
//     if(snapshot.exists()) {
//         console.log(snapshot.val());
//     } else {
//         console.log("No data available");
//     }
//     }).catch((error) => {
//         console.error(error);
//     });
// });