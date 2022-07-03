import React, { useState, useEffect } from "react";
import styled from 'styled-components'

import { v4 as uuidv4 } from 'uuid';

import Button from "../components/fragments/Button";

import { database } from "../api/firebase";
import { ref, set, child, get, remove } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from "../store/application/useApplicationStore";

const MenageTopicsPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { topic } = useApplicationStore()

    const deleteDataHandler = event => {
        remove(ref(database, `pretenderGame/topics/` + event.target.id))
        const filtered = topic.filter( value => { return !value.includes(event.target.id) })
        applicationDispatch({ type: 'set-topic', payload: filtered })
    }

    const editDataHandler = event => {
        get(child(ref(database), `pretenderGame/topics/${event.target.id}`)).then((snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.val()
                // const dataKey = snapshot.key
                applicationDispatch({ type: 'set-editing-topic', payload: { name: event.target.id, topic:data } })
                applicationDispatch({ type: 'set-page', payload: 'createTopic' })
                } else {
                    console.log("No data available");
                }
                }).catch((error) => {
                    console.error(error);
                });
    }

    const setPage = props => {
        applicationDispatch({ type: 'set-page', payload: props })
    }

    return (
        <MenageTopicsPageWrapper>
            <Section>
                <TitleSection>
                    <Text color='blue'>
                        <a onClick={() => setPage('gameSetup')}>BACK TO GAME SETUP</a>
                    </Text>
                    <Text fontSize='45px' >TOPICS</Text>
                </TitleSection>
                <Button
                    color='blue'
                    margin='115px 0 0 0 '    
                    label='CREATE NEW TOPIC'
                    onClick={() => setPage('createTopic')}
                />
            </Section>
            {topic.map(element => {
                return (
                    <TopicHolder key={uuidv4()}>
                        <Text
                            fontSize='30px'
                            color='gray'
                            margin='0 0 0 25px'
                        >
                            {element}
                        </Text>
                        <ButtonWrapper>
                            <Button
                                color='blue'
                                id={element}
                                label='EDIT'
                                margin='0 15px 0 0'
                                onClick={editDataHandler}
                            />
                            <Button
                                color='red'
                                id={element}
                                label='DELETE'
                                margin='0 15px 0 0'
                                onClick={deleteDataHandler}
                            />
                        </ButtonWrapper>
                    </TopicHolder>
                )
            })}
        </MenageTopicsPageWrapper>
    )
}

const MenageTopicsPageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Section = styled.section`
    display: flex
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
    margin: ${props => props.margin};
    white-space: pre-wrap;

    a { cursor: pointer };
`
const ButtonWrapper = styled.div`
    display: flex;
`
const TopicHolder = styled.div`
    width: 60vw;
    height: 60px;
    border: 2px solid gray;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 15px 0
`
export default MenageTopicsPage