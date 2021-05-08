import TableTasks from "./table_task.js"
import TableRecords from "./table_records.js"
import AddRecord from "./add_record.js"
import AddTask from "./add_task.js"

export default class View {
  constructor() {
    this.table_tasks = new TableTasks()
    this.table_records = new TableRecords()
    this.add_record = new AddRecord()
    this.add_task = new AddTask()

    this.add_record.onAction((task_id, value) => this.addRecord(task_id, value))
    this.add_task.onAction(name => this.addTask(name))
    this.table_tasks.setCallbacks({
      cancelEditTask: () => this.table_tasks.render(),
      editTask: (id, name) => this.editTask(id, name),
      deleteTask: (id) => this.deleteTask(id)
    })
    this.table_records.setCallbacks({
      deleteRecord: (id) => this.deleteRecord(id),
      editRecord: (id, task_id, value) => this.editRecord(id, task_id, value)
    })
  }

  setModel(model) {
    this.model = model
  }

  async load() {
    await this.model.load()
    this.table_tasks.setData(this.model.getTasks())
    this.table_records.setData(this.model.getRecords(), this.model.getTasks())
    this.add_record.setData(this.model.getTasks())

    this.table_tasks.render()
    this.table_records.render()
  }

  async addTask(name) {
    await this.model.addTask(name)
    this.table_tasks.render()
  }

  async editTask(id, name) {
    await this.model.editTask(id, name)
    this.table_tasks.render()
    this.table_records.render()
  }

  async deleteTask(id) {
    await this.model.deleteTask(id)
    this.table_tasks.render()
    this.table_records.render()
  }

  async addRecord(task_id, value) {
    await this.model.addRecord(task_id, value)
    this.table_records.render()
    this.table_tasks.render()
  }

  async editRecord(id, task_id, value) {
    await this.model.editRecord(id, task_id, value)
    this.table_records.render()
    this.table_tasks.render()
  }

  async deleteRecord(id) {
    await this.model.deleteRecord(id);
    this.table_records.render()
    this.table_tasks.render()
  }

}