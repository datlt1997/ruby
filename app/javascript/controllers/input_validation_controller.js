import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['errorContainer']

  async validate(event) {
    const formData = await event.detail.formSubmission
    const { success, fetchResponse } = formData.result
    if (success) return

    const res = await fetchResponse.responseText
    const { errors } = JSON.parse(res)

    this.errorContainerTargets.forEach((errorContainer) => {
      const errorType = errorContainer.dataset.errorType
      const errorMsg = extractError({ errors, type: errorType })
      errorContainer.innerText = errorMsg || ''
    })
  }
}

function extractError({ errors, type }) {
  if (!errors || !Array.isArray(errors)) return

  const foundError = errors.find(
    (error) => error.type.toLowerCase() === type.toLowerCase()
  )
  return foundError?.detail
}