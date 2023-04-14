from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

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
