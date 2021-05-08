from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_login import LoginManager, login_user, current_user, login_required, logout_user
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import waitress
import db

app = Flask(__name__)
app.secret_key = "super key"
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db.db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.login_message = "Please log in to access this page.."
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return db.User.query.get(int(user_id))

@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route("/validate_login", methods=["POST"])
def validate_login():
  CLIENT_ID = "204095740277-8khgna7ci9g251auvrsn4mvdrgjgup1i.apps.googleusercontent.com"
  try:
      user_token = request.json.get("user_token") 
      idinfo = id_token.verify_oauth2_token(user_token, requests.Request(), CLIENT_ID)
      us = db.User.query.filter_by(email=idinfo["email"]).first()
      if not us:
          us = db.addUser(idinfo["name"], idinfo["email"], idinfo["picture"])
      login_user(us)
      return jsonify(success=True)
  except ValueError:
      return jsonify(success=False)

@app.route("/userdata", methods=["GET", "POST"])
@login_required
def getUserData():
  return jsonify(
      tasks = db.getTasks(current_user.user_id),
      records = db.getRecords(current_user.user_id)
  )

@app.route("/addtask", methods=["POST"])
def addTask():
  name = request.json.get("name")
  task = db.addTask(current_user.user_id, name)
  if (task):
    return jsonify(success=True, task_id=task.task_id)
  else:
    return jsonify(success=False)

@app.route("/edittask", methods=["POST"])
def editTask():
  id = request.json.get("id")
  name = request.json.get("name")
  if (db.editTask(current_user.user_id, id, name)):
    return jsonify(success=True)
  else:
    return jsonify(success=False)

@app.route("/deletetask", methods=["POST"])
def deleteTask():
  id = request.json.get("id")
  if db.deleteTask(current_user.user_id, id):
    return jsonify(success=True)
  else:
    return jsonify(success=False)

@app.route("/addrecord", methods=["POST"])
def addRecord():
  task_id = request.json.get("task_id")
  value = request.json.get("value")
  record = db.addRecord(current_user.user_id, task_id, value)
  if (record):
    return jsonify(success=True, id=record.record_id)
  else:
    return jsonify(success=False)

@app.route("/editrecord", methods=["POST"])
def editRecord():
  id = request.json.get("id")
  task_id = request.json.get("task_id")
  value = request.json.get("value")
  if db.editRecord(current_user.user_id, id, task_id, value):
    return jsonify(success=True)
  else:
    return jsonify(success=False)

@app.route("/deleterecord", methods=["POST"])
def deleteRecord():
  id = request.json.get("id")
  if db.deleteRecord(current_user.user_id, id):
    return jsonify(success=True)
  else:
    return jsonify(success=False)


if __name__ == "__main__":
    app.debug = False
    waitress.serve(app)