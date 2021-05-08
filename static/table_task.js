export default class TableTasks {
  constructor() {
    this.table = document.querySelector("#table-tasks tbody")
  }

  setData(tasks) {
    this.tasks = tasks
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks
  }

  render() {
    this.table.innerHTML = ""
    for (const task of this.tasks.values()) {
      let row = this.table.insertRow()
      row.innerHTML = `
        <td class="align-middle text-capitalize">${task.name}</td>
        <td class="align-middle">${task.value}</td>
        <td class="align-middle">
            <div style="display:flex" data-name="${task.name}" data-id="${task.id}">
                <i class="fa fa-pencil btn btn-outline-primary btn-sm "> </i>
                <i class="fa fa-trash btn btn-outline-danger btn-sm" ></i>
                <i class="fa fa-hand-o-right btn btn-outline-success btn-sm" ></i>
            </div>
        </td>
      `
    }

    // select task 
    let name = document.querySelector("#add-record input[name='name']")
    Array.from(this.table.querySelectorAll("i.fa.fa-hand-o-right"))
      .map(sel => sel.onclick = e => {
        name.value = e.target.parentElement.dataset.name;
      })

    // edit task
    Array.from(this.table.querySelectorAll("i.fa.fa-pencil"))
      .map(eel => eel.onclick = async e => {
        let id = e.target.parentElement.dataset.id
        let row = e.target.parentElement.parentElement.parentElement
        row.innerHTML = `
            <td class="align-middle text-capitalize" colspan="2">
                <input type="text" class="form-control text-capitalize" placeholder="New name">
            </td>
            <td class="align-middle">
                <i class="fa fa-floppy-o btn btn-outline-success btn-sm"></i>
                <i class="fa fa-times btn btn-sm btn-outline-danger"></i>
            </td>
        `
        row.querySelector("i.fa.fa-floppy-o")
          .onclick = async () => {
            let name = row.querySelector("input").value
            await this.callbacks.editTask(parseInt(id), name.toLowerCase())
          }

        row.querySelector("i.fa.fa-times")
          .onclick = () => {
            this.callbacks.cancelEditTask()
          }

      }

      )

    // delete task
    Array.from(this.table.querySelectorAll("i.fa.fa-trash"))
      .map(del => del.onclick = async e => {
        let id = e.target.parentElement.dataset.id
        await this.callbacks.deleteTask(parseInt(id));
      })

  }
}