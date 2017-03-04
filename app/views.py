from app import app
import json
from flask import render_template, json, jsonify
from app.core.json_assembler import *

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/get_data')
def get_data():
    json_assembler = JSONAssembler(app.root_path+"/core/core_config.json")
    return json_assembler.get_full_json()