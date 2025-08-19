import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["select"]

  change(event) {
    event.preventDefault()
    const locale = event.target.value
    const currentPath = window.location.pathname.split("/")
    console.log(currentPath, locale)

    // thay đổi locale (index 1 của path, vì path = /vi/admin => ["", "vi", "admin"])
    currentPath[1] = locale

    // giữ nguyên query string nếu có
    const newUrl = currentPath.join("/") + window.location.search
    console.log(newUrl);
    window.location.href = newUrl
  }
}
