import React from "react";

import PretenderGameSetupPage from "./pages/PretenderGameSetupPage";
import PretenderGameLoadingPage from "./pages/PretenderGameLoadingPage";
import PretenderPreparationPhase from "./pages/PretenderPreparationPhasePage";
import PretenderUserPage from "./pages/PretenderUserPage";
import PretenderVotingPage from "./pages/PretenderVotingPage";
import PretenderResultPage from "./pages/PretenderResultPage";

import { useApplicationStore } from "../store/application/useApplicationStore";


const ThePretenderPage = () => {
    const { pretenderPage } = useApplicationStore()

    let pageToDisplay

    switch (pretenderPage) {
        case 'pretenderGameSetup':
            pageToDisplay = <PretenderGameSetupPage />
            break
        case 'pretenderGameLoading':
            pageToDisplay = <PretenderGameLoadingPage />
            break
        case 'pretenderGamePreparationPhase':
            pageToDisplay = <PretenderPreparationPhase />
            break
        case 'pretenderUserPage':
            pageToDisplay = <PretenderUserPage />
            break
        case 'pretenderVotingPage':
            pageToDisplay = <PretenderVotingPage />
            break
        case 'pretenderResultPage':
            pageToDisplay = <PretenderResultPage />
            break
        default: pageToDisplay = undefined
    }

    return <>{pageToDisplay}</>
}

export default ThePretenderPage