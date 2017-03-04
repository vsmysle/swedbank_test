from app import app
import json
from flask import render_template, json, jsonify


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/get_data')
def get_data():
    geojson = json.load(open("app/data/sihtnumbri_areaalid.geojson"))
    return jsonify(geojson)