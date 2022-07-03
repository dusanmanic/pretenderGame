import React from 'react'

import { useApplicationStore } from '../store/application/useApplicationStore'

import LoginPage from '../pages/LoginPage'
import GameSelectionPage from '../pages/GameSelectionPage'
import GameSetupPage from '../pages/GameSetupPage'
import MenageTopicsPage from '../pages/MenageTopicsPage'
import CreateTopicPage from '../pages/CreateTopicPage'
import PreparationPhase from '../pages/PreparationPhase'
import ResultPage from '../thePretender/pages/ResultPage'

const Router = () => {
    const { page } = useApplicationStore()

    let pageToDisplay

    switch (page) {
        case 'login':
            pageToDisplay = <LoginPage />
            break
        case 'gameSelection':
            pageToDisplay = <GameSelectionPage />
            break
        case 'gameSetup':
            pageToDisplay = <GameSetupPage />
            break
        case 'menageTopics':
            pageToDisplay = <MenageTopicsPage />
            break
        case 'createTopic':
            pageToDisplay = <CreateTopicPage />
            break
        case 'preparationPhase':
            pageToDisplay = <PreparationPhase />
            break
        case 'result':
        pageToDisplay = <ResultPage />
            break
        default: pageToDisplay = undefined
    }

    return <>{pageToDisplay}</>
}

export default Router;