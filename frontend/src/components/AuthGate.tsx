import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from 'firebase/auth'

export default function AuthGate(){
  const [user, setUser] = useState<any>(null)
  useEffect(()=> onAuthStateChanged(auth, setUser), [])
  const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
  const signInWithFacebook = () => signInWithPopup(auth, new FacebookAuthProvider())
  return (
    <div aria-label="auth-controls">
      {user ? (
        <button onClick={()=>signOut(auth)}>Sign out</button>
      ) : (
        <div role="group" aria-label="Sign in options">
          <button onClick={signInWithGoogle}>Sign in with Google</button>
          <button onClick={signInWithFacebook}>Sign in with Facebook</button>
        </div>
      )}
    </div>
  )
}

