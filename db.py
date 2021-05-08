"""
TODO
- delete innecesary validators
"""

from functools import reduce
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.orm import validates

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True)
    email = db.Column(db.String(), unique=True)
    img_url = db.Column(db.String(), unique=True)
    # rels 
    tasks = db.relationship("Task", backref="user", lazy="dynamic")

    def __repr__(self) -> str:
        return (f"<User(name={self.name}, "
                f"email={self.email}, "
                f"tasks=[{self.tasks.count()} elems.], ")

    def serialize(self):
        return {"user_id": self.user_id,
                "name": self.name,
                "email": self.email,
                "img_url": self.img_url,
                "tasks": [t.serialize() for t in self.tasks]}

    def get_id(self):
        return self.user_id
    
    def exist(key, field):
        return User.query.filter(getattr(User, key)==field).count() != 0 
    
    @validates("name", "email", "img_url")
    def validate_uniques(self, key, field):
        if User.query.filter(getattr(User, key)==field).count() > 0:
            raise AssertionError(f"UNIQUE DUPLICATE on {key}={field}")
        return field

class Task(db.Model):
    __tablename__ = "task"
    task_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    name = db.Column(db.String)
    # rels 
    records = db.relationship("Record", backref="task", lazy="dynamic")
    
    @property
    def value(self):
        return reduce(lambda sum, r: sum+r.value, self.records, 0)

    def __repr__(self):
        return (f"<Task(user={self.user.name}, "
                f"name={self.name}, "
                f"value={self.value}, "
                f"records=[{self.records.count()} elems.]")
    
    def serialize(self):
        return {"user_id": self.user_id,
                "task_id": self.task_id,
                "name": self.name,
                "value": self.value,
                "records": [r.serialize() for r in self.records]}
    
    def exist(key, field):
        return Task.query.filter(getattr(Task, key)==field).count() != 0 

    @validates("name")
    def validate_uniques(self, key, field):
        if User.query.filter(getattr(User, key)==field).count() > 0:
            raise AssertionError(f"UNIQUE DUPLICATE on {key}={field}")
        return field

    @validates("user_id")
    def validate_user_id(self, key, field):
        if not User.exist(key, field):
            raise AssertionError(f"NO EXIST on {key}={field}")
        return field
          

class Record(db.Model):
    __tablename__ = "record"
    record_id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, default=datetime.now().date())
    time = db.Column(db.Time, default=datetime.now().time())
    task_id = db.Column(db.Integer, db.ForeignKey("task.task_id"))

    def __repr__(self):
        return (f"<Record(user={self.task.user.name}, "
                f"task={self.task.name}, "
                f"value={self.value}, "
                f"date={self.date}, "
                f"time={self.time}, ")
    
    def serialize(self):
        return {"user_id": self.task.user.user_id,
                "task_id": self.task_id,
                "record_id": self.record_id,
                "value": self.value,
                "date": str(self.date),
                "time": str(self.time)}
    
    def exist(key, field):
        return Record.query.filter(getattr(Record, key)==field).count() != 0 
    
    @validates("task_id")
    def validate_user_id(self, key, field):
        if not Task.exist(key, field):
            raise AssertionError(f"NO EXIST on {key}={field}")
        return field

# decorators

def validate(f):
    def w(*args, **kwargs):
        try:
            res = f(*args, **kwargs)
            db.session.commit()
            return res or True
        except AssertionError as e:
            print(f"[AssertionError]{e}")
            return False
        except Exception as e:
            print(f"[Exception]{e}")
            return False
    return w 

def addUser(name, email, img_url):
  user = User(name=name, email=email, img_url=img_url)
  db.session.add(user)
  db.session.commit()
  return user

def getTasks(user_id):
  user = User.query.filter_by(user_id=user_id).first_or_404()
  return [t.serialize() for t in user.tasks]

def getRecords(user_id):
  user = User.query.filter_by(user_id=user_id).first_or_404()
  return [r.serialize() for t in user.tasks for r in t.records]

@validate
def addTask(user_id, name):
  task = Task(user_id=user_id, name=name)
  db.session.add(task)
  return task

@validate
def editTask(user_id, id, name):
  task = Task.query.filter_by(user_id=user_id, task_id=id).first_or_404()
  task.name = name

@validate
def deleteTask(user_id, id):
  task = Task.query.filter_by(user_id=user_id, task_id=id).first_or_404()
  task.records.delete()
  db.session.delete(task)

@validate
def addRecord(user_id, task_id, value):
  task = Task.query.filter_by(user_id=user_id, task_id=task_id).first_or_404()
  record = Record(task=task, value=value)
  db.session.add(record)
  return record

@validate
def editRecord(user_id, record_id, task_id, value):
  record = Record.query.join(Task).\
    filter(Task.user_id==user_id).\
    filter(Record.record_id==record_id).first_or_404()
  record.task_id = task_id
  record.value = value

@validate
def deleteRecord(user_id, id):
  record = Record.query.join(Task).\
    filter(Task.user_id==user_id, Record.record_id==id).first_or_404()
  db.session.delete(record)