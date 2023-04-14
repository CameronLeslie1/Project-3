from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

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

if __name__ == '__main__':
    app.run(debug=True, port=5001)

# Starting my app route

@app.route('/data/<state>')
def get_data(state):
    conn = sqlite3.connect('covid.sqlite')
    cursor = conn.cursor()

    query = f'SELECT date, cases FROM "{state} Aggregated";'
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = []
    for row in rows:
        data.append({'date': row[0], 'cases': row[1]})

    return(jsonify(data))

if __name__ == '__main__':
    app.run(debug=True, port=5001)