import React, { useEffect } from 'react'
import { Routes, Route, Link } from "react-router-dom";

import { database } from './api/firebase';
import { ref, set, child, get } from "firebase/database";

import ThePretenderPage from './thePretender/ThePretenderPage';
import HomePage from './pages/HomePage';

import Router from './wrappers/Router';

import { useApplicationDispatch, useApplicationStore } from './store/application/useApplicationStore'


const App = () => {
  const applicationDispatch = useApplicationDispatch()

  const { gameCode } = useApplicationStore()

  useEffect(() => {
    get(child(ref(database), `pretenderGame/topics/`)).then((snapshot) => {
      if(snapshot.exists()) {
          const data = snapshot.val()
          // const dataKey = snapshot.key
          applicationDispatch({ type: 'set-topic', payload: Object.keys(data) })
          // console.log(Object.keys(data))
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
            console.error(error);
        });
    get(child(ref(database), `pretenderGame/gameInfo/`)).then((snapshot) => {
      if(snapshot.exists()) {
        const data = snapshot.val()
        // const dataKey = snapshot.key
        applicationDispatch({ type: 'set-master-data', payload: data })
        applicationDispatch({ type: 'set-game-code', payload: data.gameCode })
      } else {
          console.log("No data available");
      }
      }).catch((error) => {
          console.error(error);
      });
  }, [])

  return (
    <Routes>
      {console.log('renderuje se')}
      <Route path="/" element={<HomePage />} />
      <Route path="admin-setup-page" element={<Router />} />
      <Route path={`${gameCode}`} element={<ThePretenderPage />} />
    </Routes>    
  )
}

export default App;
