from app import app
from flask import render_template, request
from app.core.json_assembler import *


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/get_full_data')
def get_data():
    json_assembler = JSONAssembler(app.root_path+"/core/core_config.json")
    return json_assembler.get_full_json()


@app.route('/get_data_filtered')
def get_data_filtered():
    date_from = request.args.get('start', None, type=str)
    date_to = request.args.get('end', None, type=str)
    json_assembler = JSONAssembler(app.root_path + "/core/core_config.json")
    return json_assembler.get_date_range_json(date_from, date_to)

