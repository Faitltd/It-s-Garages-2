import { useState } from 'react'
import { auth, storage } from '../lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { v4 as uuid } from 'uuid'

export default function PhotoUploader() {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string|undefined>()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Images only'); return }
    if (file.size > 10*1024*1024) { setError('Max 10MB'); return }
    const uid = auth.currentUser?.uid
    if (!uid) { setError('Please sign in to upload'); return }
    setError(undefined)
    const storageRef = ref(storage, `user_uploads/${uid}/${uuid()}-${file.name}`)
    const task = uploadBytesResumable(storageRef, file)
    task.on('state_changed', s => setProgress(Math.round((s.bytesTransferred/s.totalBytes)*100)))
    task.then(()=> getDownloadURL(task.snapshot.ref)).then(()=> setProgress(100))
  }

  return (
    <section aria-labelledby="upload-heading">
      <h2 id="upload-heading">Upload photos</h2>
      <input type="file" accept="image/*" onChange={onFile} aria-describedby="upload-help" />
      <div id="upload-help">Max 10MB. JPEG/PNG preferred. You must be signed in to upload.</div>
      <progress value={progress} max={100} aria-valuetext={`${progress}%`} />
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

