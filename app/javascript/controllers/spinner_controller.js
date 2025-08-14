import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["prizeSelect", "startBtn", "stopBtn", "resultBox", "display", "resultTable"]

  connect() {
    this.timer = null
    this.names = []
    this.currentPrizeId = null
  }

  start() {
    this.currentPrizeId = this.prizeSelectTarget.value

    if (!this.currentPrizeId) {
      alert("Vui lòng chọn giải thưởng!")
      return
    }

    this.startBtnTarget.disabled = true
    this.stopBtnTarget.disabled = false

    fetch(`/admin/select_numbers/available?prize_id=${this.currentPrizeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.remaining_count === 0) {
          alert("Giải này đã hết người trúng.")
          this.removePrizeFromSelect(this.currentPrizeId)
          this.resetButtons()
          return
        }

        this.names = data.numbers
        this.runSpinner()
        this.stopTimeoutId = setTimeout(() => {
          this.stop()
        }, 3000)

        this.startButtonTarget.disabled = true
        this.stopButtonTarget.disabled = false
      })
  }

  runSpinner() {
    this.timer = setInterval(() => {
      const randomName = this.names[Math.floor(Math.random() * this.names.length)]
      this.displayTarget.textContent = randomName
    }, 50)
  }

  stop() {
    clearInterval(this.timer)
    this.stopBtnTarget.disabled = true

    fetch(`/admin/winners/spin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ prize_id: this.currentPrizeId })
    })
    .then(res => res.json())
    .then(data => {
      this.displayTarget.textContent = data.number
      this.resultBoxTarget.textContent = `🎉 ${data.name} 🎉`
      if (data.id) {
        this.addRow(data)
      }
      if (data.remaining_quantity === 1) {
        this.removePrizeFromSelect(this.currentPrizeId)
      }

      this.resetButtons()
    })
  }

  removePrizeFromSelect(prizeId) {
    const option = this.prizeSelectTarget.querySelector(`option[value="${prizeId}"]`)
    if (option) option.remove()
  }

  addRow(winner) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${winner.id}</td>
      <td>${winner.name}</td>
      <td>${winner.number}</td>
      <td>${winner.prize}</td>
    `
    this.resultTableTarget.querySelector("tbody").appendChild(row)
  }

  resetButtons() {
    this.startBtnTarget.disabled = false
    this.stopBtnTarget.disabled = true
  }
}
