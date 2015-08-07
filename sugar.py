from flask import Flask, render_template, abort, request, jsonify, g
import sqlite3, math, json


DATABASE = 'nutrients.db'

app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/nutrients_sugarcontent/<food_id>')
def find_foodid(food_id):
	data = ''
	c = get_db().cursor()
	for row in c.execute('SELECT Nutr_Val FROM nut_data WHERE NDB_No=? AND Nutr_No = "269"', [food_id]):
		data = row[0]
	return data

@app.route('/nutrients_suggest/<food_partial>')
def find_foodsuggest(food_partial):
	data = []
	c = get_db().cursor()
	for row in c.execute('SELECT Long_Desc, NDB_No FROM food_des WHERE Long_Desc LIKE ? LIMIT 10', ['%'+food_partial+'%']):
		data.append({"value":row[0],"data":row[1]})
	return jsonify(	suggestions=data)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def connect_db():
    return sqlite3.connect(DATABASE)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug='True')

