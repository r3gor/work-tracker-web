export default class AddTask {
  constructor() {
    this.element = document.querySelector("#add-task")
    this.name = this.element.querySelector("input[name='name']")
  }

  onAction(callback) {
    let btn = this.element.querySelector("i.fa.fa-floppy-o")
    btn.onclick = async () => await callback(this.name.value.toLowerCase())
  }
}