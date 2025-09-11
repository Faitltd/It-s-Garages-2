import axios from 'axios'

export async function validateAddress(address){
  const key = process.env.ADDRESS_VALIDATION_API_KEY
  if (!key) return address
  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${key}`
  try {
    const payload = { address: { addressLines: [address.line1], postalCode: address.zip, administrativeArea: address.state, locality: address.city } }
    const { data } = await axios.post(url, payload)
    return { ...address, _validation: data.result?.verdict }
  } catch (e) {
    return address
  }
}

