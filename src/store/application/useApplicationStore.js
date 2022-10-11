import makeStore from "../makeStore"

const game = {
    name: '',
    topic: []
}

const topic = { }

const initialState = {
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
    topicDisplayName: '',
    presentationDuration: '',
    game,
    gameCode: null,
    topic,
    editTopic: { 
        name: '',
        topic: []
    },
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'reset-defaults': return { initialState: action.payload }
        case 'set-master-data': return { ...state, masterData: action.payload }
        case 'set-user-data': return { ...state, userData: action.payload }
        case 'set-logged': return { ...state, logged: action.payload }
        case 'set-page': return { ...state, page: action.payload }
        case 'set-selected-game': return { ...state, selectedGame: action.payload }
        case 'set-game': return { ...state, game: action.payload }
        case 'set-topic': return { ...state, topic: action.payload }
        case 'set-topic-display-name': return { ...state, topicDisplayName: action.payload }
        case 'set-selected-topic': return { ...state, selectedTopic: action.payload }
        case 'set-editing-topic': return { ...state, editTopic: action.payload }
        case 'set-game-code': return { ...state, gameCode: action.payload }
        case 'set-pretender-user': return { ...state, pretenderUser: action.payload }
        case 'set-game-duration': return { ...state, gameDuration: action.payload }
        case 'set-presentantion-duration': return { ...state, presentationDuration: action.payload }
        case 'set-pretenderPage': return { ...state, pretenderPage: action.payload }
        case 'set-pretender-word': return { ...state, selectedWord: action.payload }
        default: throw new Error('Unknown action!', action)
    }
}

const [ApplicationProvider, useApplicationStore, useApplicationDispatch] = makeStore(reducer, initialState)

export { ApplicationProvider, useApplicationStore, useApplicationDispatch }