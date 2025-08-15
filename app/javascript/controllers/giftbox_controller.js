import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["box", "submitButton", "container", "btnResult"]

  connect() {
    this.selectedNumber = null
  }

  select(event) {
    const btn = event.currentTarget

    if (this.selectedNumber === btn.dataset.number) {
      btn.classList.remove("selected-number")
      this.selectedNumber = null
    } else {
      this.boxTargets.forEach(box => box.classList.remove("selected-number"))

      btn.classList.add("selected-number")
      this.selectedNumber = btn.dataset.number
    }
  }

  submit() {
    if (!this.selectedNumber) {
      alert("Vui lòng chọn một số!")
      return
    }

    fetch("/user/choose-number", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
      },
      body: JSON.stringify({ number: this.selectedNumber })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`Bạn đã chọn số ${this.selectedNumber}`)
        const btn = this.boxTargets.find(b => b.dataset.number === this.selectedNumber)
        this.boxTargets.forEach(box => {
          if (box !== btn) {
            box.classList.add("disabled")
            box.setAttribute("disabled", true)
            box.removeAttribute("data-action")
          }
        })
        btn.disabled = true
        btn.classList.remove("selected")
        this.selectedNumber = null
        this.submitButtonTarget.style.display = "none"
        this.btnResultTarget.classList.remove("d-none")
      } else {
        alert(data.message || "Có lỗi xảy ra")
      }
    })
  }
}
