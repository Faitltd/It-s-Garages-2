import { useState } from 'react'

export default function SizeWizard() {
  const [size, setSize] = useState('')
  return (
    <section aria-labelledby="size-heading">
      <h2 id="size-heading">Select your door size</h2>
      <label>
        <span className="sr-only">Door size</span>
        <select aria-label="Door size" value={size} onChange={e=>setSize(e.target.value)}>
          <option value="">Choose…</option>
          <option>8x7</option>
          <option>9x7</option>
          <option>16x7</option>
        </select>
      </label>
    </section>
  )
}

