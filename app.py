from flask import Flask, jsonify, render_template
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    conn = sqlite3.connect('covid.sqlite')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM daily_cases_increase')
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = []
    for row in rows:
        data.append({'date': row[0], 'datetime': row[1], 'state': row[2], 'positive': row[3], 'positiveIncrease': row[4]})

    return(jsonify(data))


# Starting my app route

@app.route('/data/<state>')
def get_state_data(state):
    conn = sqlite3.connect('covid.sqlite')
    cursor = conn.cursor()

    query = f'SELECT date, cases, hospitalizations, deaths FROM "{state} Aggregated";'
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = []
    for row in rows:
        data.append({'date': row[0], 'cases': row[1], 'hospitalizations': row[2], 'deaths':row[3]})

    return(jsonify(data))

if __name__ == '__main__':
    app.run(port=5001)