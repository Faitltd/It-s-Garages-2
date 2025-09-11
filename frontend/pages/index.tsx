import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Its Garages</h1>
      <p>Automated garage door ordering.</p>
      <nav>
        <ul>
          <li><Link href="/wizard">Start Size Selection</Link></li>
        </ul>
      </nav>
    </main>
  )
}

