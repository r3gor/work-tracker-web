/**
 * RF
 * añadir-editar-borrar task
 * añadir-editar-borrar record
 * Campos Task
 * - id
 * - name
 * - value X
 * Campos Record
 * - id 
 * - task_id
 * - value
 * - date
 * - time
 */

export default class UserData {
  constructor(data = { tasks: [], records: [] }) {
    this.tasks_map = new Map(
      data.tasks.map(t => [t.task_id, new Task(t.task_id, t.name, this)]))
    this.records_map = new Map(
      data.records.map(r => [r.record_id, new Record(r.record_id, r.task_id, r.value, r.date, r.time, this)]))
  }

  addTask(id, name) {
    this.tasks_map.set(id, new Task(id, name, this))
  }

  addRecord(id, task_id, value) {
    this.records_map.set(id, new Record(id, task_id, value, NaN, NaN, this))
  }

  editTask(id, name) {
    this.tasks_map.get(id).name = name
  }

  editRecord(id, task_id, value) {
    Object.assign(this.records_map.get(id), { task_id, value })
  }

  deleteTask(id) {
    this.tasks_map.get(id).deleteRecords()
    this.tasks_map.delete(id);
  }

  deleteRecord(id) {
    this.records_map.delete(id)
  }

  getTasks() {
    return this.tasks_map
  }

  getRecords() {
    return this.records_map
  }
}

class Task {
  constructor(id, name, userdata) {
    this.udata = userdata
    this.id = id
    this.name = name
  }

  deleteRecords() {
    [...this.udata.records_map.keys()]
      .filter(k => this.udata.records_map.get(k).task_id == this.id)
      .map(k => this.udata.records_map.delete(k))
  }

  get value() {
    return [...this.udata.records_map.values()]
      .filter(v => v.task_id == this.id)
      .reduce((s, curr) => s + curr.value, 0)
  }
}

class Record {
  constructor(id, task_id, value, date, time, userdata) {
    this.udata = userdata
    this.id = id
    this.task_id = task_id
    this.value = value
    if (!date || !time) {
      let date = new Date()
      this.time = {
        hour: date.getHours(),
        minute: date.getMinutes()
      }
      this.date = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      }
    } else {
      this.time = time
      this.date = date
    }
  }

  get task_name() {
    return this.udata.tasks_map.get(this.task_id).name
  }
}


// ud = new UserData()
// ud.addTask(1, "estudiar")
// ud.addTask(2, "ejercitarse")
// ud.addTask(3, "responsabilidades")
// ud.addRecord(1, 1, 2)
// ud.addRecord(2, 1, 10)
// ud.addRecord(3, 2, 4)
// ud.addRecord(4, 3, 6)

// tasks = ud.getTasks()
// console.log(tasks)
// console.log(tasks[0].value)
// console.log(ud)

// console.log(ud.tasks_map.get(1).value)
// console.log(ud.records_map.get(4).task_name)