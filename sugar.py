from flask import Flask, render_template, abort, request, jsonify, g
import sqlite3, math, json


DATABASE = 'nutrients.db'

app = Flask(__name__)

@app.route('/')
def toc():
	return render_template('toc.html')

@app.route('/sugar')
def home_page():
    return render_template('index.html')

@app.route('/nutrient_index')
def food_index():
    return render_template('study.html')

@app.route('/nutrients_sugarcontent/<food_id>')
def find_foodid(food_id):
	data = []
	c = get_db().cursor()
	for row in c.execute('SELECT b.nutrdesc, b.tagname, a.Nutr_Val, b.nutr_no FROM nut_data a, nutr_def b WHERE a.NDB_No=? AND a.nutr_no = b.nutr_no AND (a.Nutr_No = "269" OR a.Nutr_No = "208")', [food_id]):
		data.append({"nutrient":row[0]+"("+row[1]+")","value":row[2], "nutr_code":row[3]})
	return jsonify(nutrients=data)

@app.route('/nutrient_dictionary/')
def find_nutdef():
	data = []
	c = get_db().cursor()
	for row in c.execute('SELECT * FROM nutr_def ORDER BY Nutr_No'):
		data.append({"nutrient":row[3],"key":row[0], "tagname":row[2], "unit":row[1], "checked":"", "good":"", "index":"", "dv":""})
	return jsonify(nutrients=data)

@app.route('/nutrients_suggest/<food_partial>')
def find_foodsuggest(food_partial):
	data = []
	c = get_db().cursor()
	for row in c.execute('SELECT Long_Desc, NDB_No FROM food_des WHERE Long_Desc LIKE ? LIMIT 20', ['%'+food_partial+'%']):
		data.append({"value":row[0],"data":row[1]})
	return jsonify(	suggestions=data)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
    return db

@app.route('/nutrients_foodIndex/<food_id>')
def find_foodindex(food_id):
	data = []
	c = get_db().cursor()
	for row in c.execute('SELECT b.nutrdesc, b.tagname, a.Nutr_Val, b.nutr_no, c.Long_Desc, b.Units FROM nut_data a, nutr_def b, food_des c WHERE a.NDB_No=? AND c.NDB_No = a.NDB_No AND a.nutr_no = b.nutr_no AND (a.Nutr_No IN ("203","291","318","401","573","301","303","304","306","606","269","307","323"))', [food_id]):
		food_name = row[4]
		data.append({"nutrient":row[0]+"("+row[1]+")","value":row[2], "nutr_code":row[3], "unit":row[5]})
	return jsonify(nutrients={"name":food_name,"nutrients":data})

@app.route('/nutrient_query/<food_id>/<nutrient_array>')
def find_foodIndexFromArray(food_id, nutrient_array):
	data = []
	dataLike = nutrient_array.split(",")
	dataLike2 = "'" + "','".join(map(str, dataLike)) + "'"
	food_name =" "
	c = get_db().cursor()
	for row in c.execute('SELECT b.nutrdesc, b.tagname, a.Nutr_Val, b.nutr_no, b.Units, c.Long_Desc FROM nut_data a, nutr_def b, food_des c WHERE a.NDB_No=? AND c.NDB_No = a.NDB_No AND a.nutr_no = b.nutr_no AND (a.Nutr_No IN (' + dataLike2 + '))', [food_id]):
		food_name = row[5]
		data.append({"nutrient":row[0]+"("+row[1]+")","value":row[2], "nutr_code":row[3], "unit":row[4]})
	return jsonify(nutrients={"name":food_name,"nutrients":data})

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def connect_db():
    return sqlite3.connect(DATABASE)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug='True')

