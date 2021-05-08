export default class EditRecord{
  constructor(){
    this.element = document.querySelector("#edit-record")

  }

  setData(records, tasks){
    this.records = records
    this.tasks = tasks
  }

  onAction(callback, id){
    let record = this.records.get(id)
    let body = this.element.querySelector(".modal-body")
    
    body.innerHTML = ""
    
    let options = document.createElement("select")
    options.setAttribute("class", "form-select text-capitalize")
    options.setAttribute("id", "edit-record-task");
    [...this.tasks.values()].map(t => {
        let opt = document.createElement("option")
        opt.setAttribute("data-id", t.id)
        opt.value = t.name
        opt.text = t.name
        if (t.id == record.task_id){
            opt.setAttribute("selected", "selected")
        }
        options.add(opt, null)
      })
    
    body.innerHTML = `
      <div class="mb-3">
        <label for="edit-record-task" class="form-label">Task</label>
        ${options.outerHTML}
      </div>

      <div class="mb-3">
        <label for="edit-record-value" class="form-label">Value</label>
        <div class="mb-3" id="edit-record-value">
          <label id="lbl-edit-record-range" for="edit-record-range" class="form-label "> ${record.value} </label>
          <input id="edit-record-range" type="range" class="form-range mb-3" min="0" max="10" value=${record.value}>
        </div>
      </div>
      `
    let lbl = this.element.querySelector("#edit-record-value label")
    let range = this.element.querySelector("#edit-record-value input")
    range.onchange = e => {
      lbl.innerText = e.target.value
    }

    let btn = this.element.querySelector("button.btn.btn-primary")
    let btn_close = this.element.querySelector("button.btn.btn-secondary")
    btn.onclick = async () => {
      let task_name = this.element.querySelector("#edit-record-task")
      let task_id = this.getTaskId(task_name.value)
      let value = range.value
      await callback(id, task_id, parseInt(value))
      btn_close.click()
    }
  }

  getTaskId(task_name) {
    return [...this.tasks.values()].filter(t => t.name == task_name)[0].id
  }
}
