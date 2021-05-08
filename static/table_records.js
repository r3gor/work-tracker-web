import EditRecord from "./edit_record.js"

export default class TableRecords {
  constructor() {
    this.table = document.querySelector("#table-records tbody")
    this.edit_record = new EditRecord()
  }

  setData(records, tasks) {
    this.records = records
    this.tasks = tasks
    this.edit_record.setData(records, tasks)
  }

  setCallbacks(callbacks){
    this.callbacks = callbacks
  }

  render() {
    this.table.innerHTML = ""
    for (const record of this.records.values()) {
      let row = this.table.insertRow()
      row.innerHTML = `
        <td class="align-middle">
        ${record.date}<br>
        (${record.time})
        </td>
        <td class="align-middle">
        ${record.task_name}<br>
        (Value: ${record.value})
        </td>
        <td class="align-middle" data-id="${record.id}">
            <i class="fa fa-pencil btn btn-outline-primary btn-sm "> </i>
            <i class="fa fa-trash btn btn-outline-danger btn-sm" ></i>
        </td>
      `
    }

    // edit record
    Array.from(this.table.querySelectorAll("i.fa.fa-pencil"))
      .map(eel => {
        eel.onclick = e => {
          let id = e.target.parentElement.dataset.id
          this.edit_record.onAction((id, task_id, value) => this.callbacks.editRecord(id, task_id, value), parseInt(id))
        }
        eel.setAttribute("data-bs-toggle", "modal")
        eel.setAttribute("data-bs-target", "#edit-record")
      }) 

    // delete record
    Array.from(this.table.querySelectorAll("i.fa.fa-trash"))
      .map(del => del.onclick = async e => {
        let id = e.target.parentElement.dataset.id
        await this.callbacks.deleteRecord(parseInt(id));
      })
  }
}