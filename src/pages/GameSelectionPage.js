import React from 'react'
import styled from 'styled-components'

import PretenderCover from '../assets/pretender_cover.png'
import NoGameCover from '../assets/no_game_cover.png'

import GameCard from '../components/GameCard'

const GameSelectionPage = () => {

  return (
    <GameSelectionPageWrapper>
        <TitleCardWrapper>
            <TitleSection>
                Select a game
            </TitleSection>
            <GameCardSection>
                <GameCard
                    image={PretenderCover}
                    title={`Who's pretending`}
                    description='It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using '
                />
                <GameCard image={NoGameCover} title='Game 2 (tbd)' />
                <GameCard image={NoGameCover} title='Game 3 (tbd)' />
                <GameCard image={NoGameCover} title='Game 4 (tbd)' />
            </GameCardSection>
        </TitleCardWrapper>
    </GameSelectionPageWrapper>
  )
}

const GameSelectionPageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const TitleCardWrapper = styled.div`

`
const TitleSection = styled.section`
    font-size: 50px;
    align-self: flex-start;
`
const GameCardSection = styled.section`
    display: flex;
`

export default GameSelectionPage;