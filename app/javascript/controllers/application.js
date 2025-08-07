import { Application } from "@hotwired/stimulus"
import FlashController from "./flash_controller"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application
application.register("flash", FlashController)

export { application }
