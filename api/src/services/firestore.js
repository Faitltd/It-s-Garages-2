import admin from 'firebase-admin'

if (!admin.apps.length) {
  // Use ADC on Cloud Run; local can pass service account JSON in env
  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (svcJson) {
    const credential = admin.credential.cert(JSON.parse(svcJson))
    admin.initializeApp({ credential })
  } else {
    admin.initializeApp()
  }
}

export const db = admin.firestore()

