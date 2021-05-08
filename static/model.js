import UserData from "./user_data.js"

export default class Model {
  constructor() {
    this.view = null
  }

  setView(view) {
    this.view = view
  }

  // methods
  async load() {
    let data = null
    await fetch("/userdata")
      .then(r => r.json())
      .then(d => data = d)
      .catch(() => console.log("Error /get_user_data"));
    this.userdata = new UserData(data)
  }

  getTasks() {
    return this.userdata.getTasks()
  }

  getRecords() {
    return this.userdata.getRecords()
  }
  
  async addTask(name) {
    await fetch("/addtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({name})
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) 
        this.userdata.addTask(d.task_id, name)
      else
        alert("Invalid information")
    })

  }
  
  async editTask(id, name) {
    await fetch("/edittask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({id, name})
    })
    .then(r => r.json())
    .then(d => {
      if (d.success)
        this.userdata.editTask(id, name)
      else
        alert("Invalid information")
    })
  }
  
  async deleteTask(id){
    await fetch("/deletetask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({id})
    })
    .then(r => r.json())
    .then(d => {
      if (d.success)
        this.userdata.deleteTask(id)
      else
        alert("Invalid information")
    })
  }
  
  async addRecord(task_id, value) {
    await fetch("addrecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({task_id, value})
    })
    .then(r => r.json())
    .then(d => {
      if (d.success)
        this.userdata.addRecord(d.id, task_id, value)
      else
        alert("Invalid information")
    })
  }

  async editRecord(id, task_id, value){
    await fetch("editrecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({id, task_id, value})
    })
    .then(r => r.json())
    .then(d => {
      if (d.success)
        this.userdata.editRecord(id, task_id, value)
      else
        alert("Invalid Information")
    })
  }

  async deleteRecord(id){
    await fetch("deleterecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({id})
    })
    .then(r => r.json())
    .then(d => {
      if (d.success)
        this.userdata.deleteRecord(id)
      else
        alert("Invalid information")
    })
  }

  // provisional
  getNewRecordId() {
    return [...this.userdata.getRecords().values()].reduce((ans, curr) => curr.id > ans ? curr.id : ans, 0) + 1
  }

  getNewTaskId() {
    return [...this.userdata.getTasks().values()].reduce((ans, curr) => curr.id > ans ? curr.id : ans, 0) + 1
  }
}