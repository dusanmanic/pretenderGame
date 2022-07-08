import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';

import { database } from '../../api/firebase';  
import { ref, set, child, get, onValue } from "firebase/database";

import { useApplicationStore, useApplicationDispatch } from '../../store/application/useApplicationStore';

import SandClockPNG from '../../assets/sand-clock.png'

import Button from '../../components/fragments/Button';
import CreateTopicFields from '../../components/CreateTopicFields'

const PretenderUserPage = () => {
    const tX30 = ['-391px', '-364px', '-337px', '-310px', '-283px', '-256px', '-229px', '-202px', '-175px', '-148px', '-121px', '-94px', '-67px', '-40px', '-13px', '14px', '41px', '68px', '95px', '122px', '149px', '176px', '203px', '230px', '257px', '284px', '311px', '338px', '365px', '392px']
    const tX45 = ['-396px', '-378px', '-360px', '-342px', '-324px', '-306px', '-288px', '-270px', '-252px', '-234px', '-216px', '-198px', '-180px', '-162px', '-144px', '-126px', '-108px', '-90px', '-72px', '-54px', '-36px', '-18px', '0px', '18px', '36px', '54px', '72px', '90px', '108px', '126px', '144px', '162px', '180px', '198px', '216px', '234px', '252px', '270px', '288px', '306px', '324px', '342px', '360px', '378px', '396px']
    
    const applicationDispatch = useApplicationDispatch()
    const { pretenderUser } = useApplicationStore()

    const [gameInfo, setGameInfo] = useState()
    const [loader, setLoader] = useState([])
    const [connectedUser, setConnectedUsers] = useState([])
    const [selectedTopic, setSelectedTopic] = useState([])
    const [roundDuration, setRoundDuration] = useState(null)
    const [inputField, setInputField] = useState('')

    let backWidth = Math.round(800/roundDuration) * roundDuration
    let loadingWidth = Math.round(800/roundDuration)
    let countdownNumber = roundDuration
    let loaderArray = []
    let tX = []

    useEffect(() => {
        get(child(ref(database), `pretenderGame/gameInfo/`)).then(snapshot => {
            setRoundDuration(snapshot.val().durationOfRound)
            const topic = snapshot.val().topic
            get(child(ref(database), `pretenderGame/topics/`)).then(snapshot => {
                Object.entries(snapshot.val()).map(element => {
                    if(element[0] === topic) {
                        setSelectedTopic({ topic: element[1] })
                    }
                })
            })
        })
    }, [])

    useEffect(() => {
        if(roundDuration === 0) {
            set(ref(database, `pretenderGame/gameInfo/players/${pretenderUser.playerURL}/inputText`), inputField)
            set(ref(database, `pretenderGame/gameInfo/players/${pretenderUser.playerURL}/addedWord`), true)
            applicationDispatch({ type: 'set-pretender-user', payload: {
                ...pretenderUser, 
                addedWord: true,
                inputText: inputField ? inputField : ''
            }})
        }
    }, [roundDuration])

    useEffect(() => {     
        let usersArray = []
        let usersPresentedArray = []
        onValue(ref(database, `pretenderGame/gameInfo/`), snapshot => {
            setGameInfo(snapshot.val())
            Object.entries(snapshot.val().players).map( object => {
                usersArray.push(object[1])
                if(object[1].id === pretenderUser.id) applicationDispatch({ type: 'set-pretender-user', payload: object[1] })

                if(object[1].finishPresenting) {
                    usersPresentedArray.push(object[1])
                    
                    if(usersPresentedArray.length === snapshot.val().usersConnected) {
                        setTimeout(() => { applicationDispatch({ type: 'set-pretenderPage', payload: 'pretenderVotingPage' }) }, 5000)
                    }
                }
            })
            setConnectedUsers(usersArray)
            // mora se isprazni, ne secam se vise zbog cega
            usersArray = [] 
            usersPresentedArray = []

        })    
    }, [])

    useEffect(() => {
        if(roundDuration === 30) tX = tX30
        if(roundDuration === 45) tX = tX45
        // if(gameInfo?.durationOfRound === 60) tX = tX60

        tX.map((x, y) => {
            const timeout = setTimeout(() => {
                countdownNumber--
                setRoundDuration(countdownNumber)
                loaderArray = [
                    ...loaderArray,
                    {
                        loadingWidth: `${loadingWidth}px`,
                        borderStart: y === 0 && true,
                        borderEnd: y === tX.length - 1 && true,
                        key: y,
                        tX: x
                    }
                ]
                setLoader(loaderArray)
                if(y === tX.length - 1) return () => clearTimeout(timeout)
            }, 1000 * y)
        })
    }, [roundDuration])

    const charactersLength = event => {
        event.preventDefault()
        setInputField(event.target.value)
    }

    const onSubmitHandler = event => {
        event.preventDefault()

        if(event.target[0].value.length === 0) {
            window.alert('You need to insert word')
        } else {
            applicationDispatch({ type: 'set-pretender-user', payload: {
                ...pretenderUser, 
                voted: true,
                inputText: event.target[0].value
            }})
            get(child(ref(database), `pretenderGame/gameInfo/players/`)).then( snapshot => {
                Object.entries(snapshot.val()).map( x => {
                    if(x[1].id === pretenderUser.id) {
                        set(ref(database, `pretenderGame/gameInfo/players/${x[0]}/inputText`), event.target[0].value)
                        set(ref(database, `pretenderGame/gameInfo/players/${x[0]}/addedWord`), true)
                    }
                })
            })
        }  
    }

    return (
        <Container>
            {!pretenderUser.finishPresenting ?
            <React.Fragment>
                <React.Fragment>
                    <Text fontSize='36px' fontWeight='bold'>The Pretender</Text>
                    <Text fontSize='22px'>Round {gameInfo?.roundsPlayed}</Text>
                </React.Fragment>
                {!pretenderUser.addedWord && 
                    <TimerWrapper backWidth={`${backWidth}px`}>
                    <Text position='absolute' fontSize='22px' color='white'>I am pretender</Text>
                    {loader.map( x => {
                        return (
                            <LoadingColor
                                loadingWidth={x.loadingWidth}
                                borderStart={x.borderStart}
                                borderEnd={x.borderEnd}
                                key={x.key}
                                tX={x.tX}
                            />
                        )
                    })}
                    <BackgroundColor backWidth={`${backWidth}px`} />
                </TimerWrapper> }
                <SectionWrapper>
                    <LeftSection>
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
                                            {pretenderUser.id === user.id ? <Text fontSize='22px'>That`s me, I am pretender</Text> : <Text fontSize='22px'>{user.inputText}</Text>}                                        
                                        </PlayersTableTD>
                                        ) })}
                                </PlayersTableTR>
                            </PlayersTable>
                        </table>
                    </LeftSection>
                    <RightSection>
                        {(selectedTopic.length !== 0 && !pretenderUser.addedWord) && <CreateTopicFields disabled defaultValue={selectedTopic} widthCalc='calc(10px + 40vw)' inputWidth='10vw' />}
                        {pretenderUser.addedWord &&                    
                            <SandClockWrapper>
                                {!pretenderUser.presenting ?
                                    <SandClock src={SandClockPNG} />
                                    :
                                    <Text fontSize='56px' fontWeight='bold' color='blue'>YOUR{'\n'}TURN</Text>
                                }
                                {!pretenderUser.presenting ? 
                                    <Text fontSize='26px' fontWeight='bold' textAlign='center' padding='25px 0 25px 0' >Wait for your turn{'\n'}to present your contribution</Text>
                                    :
                                    <Text fontSize='26px' fontWeight='bold' textAlign='center' padding='25px 0 25px 0' >Present your contribution now.{'\n'}Talk about it</Text>
                                }
                                <BackText>
                                    <Text>{pretenderUser.inputText}</Text>
                                </BackText>
                            </SandClockWrapper>
                        }
                    </RightSection>
                </SectionWrapper>
                {!pretenderUser.addedWord && 
                    <FormWrapper onSubmit={onSubmitHandler}>
                    <Text display='flex' fontSize='21px'>Enter a matching word or phrase <Text color={inputField.length === 20 ? 'red' : 'black'}>(max 20 characters)</Text>:</Text>
                    <StyledInput
                        type={'text'}
                        placeholder='Add word'
                        onChange={charactersLength}
                        maxLength='20'
                    />
                    <Button
                        disabled={pretenderUser.addedWord}
                        type='submit'
                        color='blue'
                        label='Submit'
                    />
                </FormWrapper>}
            </React.Fragment>
            :
            <WelcomeMessage>
                <Text fontSize='56px' fontWeight='bold' color='blue'>THANK YOU</Text>
                <Text display='block' fontSize='21px'>Please wait for other players{'\n'}to finish presenting...</Text>
            </WelcomeMessage>}
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
const SectionWrapper = styled.div`
    width: 85vw;
    display: flex;
    justify-content: center;
    justify-content: space-between;
    align-items: center;
`
const LeftSection = styled.section``

const RightSection = styled.section``

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
    width: 40vw;
    display: flex;
    border: 1px solid black;
`
const PlayersTableTR = styled.tr`
    width: 20vw;
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
const LoadingColor = styled.div`
    width: ${props => props.loadingWidth && props.loadingWidth};
    height: 50px;
    position: absolute;
    transform: translate(${props => props.tX && props.tX}, 0);
    ${props => props.borderStart && 'border-radius: 8px 0 0 8px;'}
    ${props => props.borderEnd && 'border-radius: 0 8px 8px 0;'}
    background-color: blue;    
`
const BackgroundColor = styled.div`
    width: ${props => props.backWidth && props.backWidth};
    height: 50px;
    border-radius: 8px;
    background-color: gray;    
`
const TimerWrapper = styled.div`
    width: ${props => props.backWidth && props.backWidth};
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid gray;
    border-radius: 8px;
    margin: 50px 0 50px 0;
`
const SandClockWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const SandClock = styled.img`
    height: 150px;
`
const BackText = styled.div`
    width: 550px;
    height: 55px;
    background-color: #dfdfdf;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
`
const FormWrapper = styled.form`
    height: 140px;
    margin: 45px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`
const StyledInput = styled.input`
    width: 500px;
    height: 40px;
    padding-left: 10px;
    border: 1px solid gray;
    border-radius: 5px
`
const WelcomeMessage = styled.div`    
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`
export default PretenderUserPage