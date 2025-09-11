import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth'

export default function AuthGate(){
  const [user, setUser] = useState<any>(null)
  useEffect(()=> onAuthStateChanged(auth, setUser), [])
  return (
    <div aria-label="auth-controls">
      {user ? (
        <button onClick={()=>signOut(auth)}>Sign out</button>
      ) : (
        <button onClick={()=>signInAnonymously(auth)}>Continue as guest</button>
      )}
    </div>
  )
}

