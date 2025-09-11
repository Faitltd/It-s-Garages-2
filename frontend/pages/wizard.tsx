import SizeWizard from '../src/components/SizeWizard'
import PhotoUploader from '../src/components/PhotoUploader'

export default function WizardPage() {
  return (
    <main>
      <h1>Order Wizard</h1>
      <SizeWizard />
      <PhotoUploader />
    </main>
  )
}

