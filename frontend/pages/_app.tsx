import type { AppProps } from 'next/app'
import '../styles.css'
import AuthGate from '../src/components/AuthGate'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthGate />
      <Component {...pageProps} />
    </>
  )
}

