'use client';

import { useEffect, useState } from 'react'
import { Login, Chat } from '@/components/';
import Zeile from './assets/Zeile';
 
export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setLoggedIn(true)
    }
    setLoaded(true)
  }, [setLoggedIn])

  if (!loaded) {
    return <Zeile width={200} />
  } else if (loggedIn) {
    return <Chat setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
  } return <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
}