export default class addRecord {
  constructor() {
    this.element = document.querySelector("#add-record")
    this.task_name = this.element.querySelector("input#task-name")
    this.value = this.element.querySelector("input#value")
  }

  setData(tasks) {
    this.tasks = tasks
  }

  onAction(callback) {
    let lbl = this.element.querySelector("label#value")
    this.value.onchange = e => {
      lbl.innerText = `Value: ${e.target.value}`
    }

    let btn = this.element.querySelector("button")
    btn.onclick = async () => {
      await callback(this.getTaskId(this.task_name.value.toLowerCase()), parseInt(this.value.value))
    }
  }

  getTaskId(task_name) {
    return [...this.tasks.values()].filter(t => t.name == task_name)[0].id
  }
}