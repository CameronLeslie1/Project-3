from flask import Flask, jsonify, render_template
import sqlite3
import os
from datetime import datetime
import json
import plotly
import pandas as pd


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

#Starting Ian's app route

@app.route('/dataIL')
def get_data():
    conn = sqlite3.connect('covid.sqlite')
    cursor = conn.cursor()
    # use WHERE date >= DATEADD(day, -7, GETDATE()) if this were still updating
    cursor.execute('SELECT * FROM daily_cases_increase WHERE date > 410 ORDER BY datetime')
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    data = {}
    df = pd.DataFrame(rows, columns=['date', 'datetime', 'state', 'positive', 'positiveIncrease'])
    dates = list(set([row[1] for row in rows]))
    dates.sort()
    for i, date in enumerate(dates):
        data[f'object{i + 1}'] = {'datetime': date, 'date': df[df['datetime'] == date]['date'].tolist(), 'state': df[df['datetime'] == date]['state'].tolist(), 'positive': df[df['datetime'] == date]['positive'].tolist(), 'positiveIncrease': df[df['datetime'] == date]['positiveIncrease'].tolist()}

    return(jsonify(data))


# Starting Cameron's app route

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

# Starting Ivans app route

@app.route('/dataIG')
def get_status_data():
    conn = sqlite3.connect('covid.sqlite')
    cursor = conn.cursor()
    query = f'SELECT date, death, hospitalizedIncrease, positiveIncrease, deathIncrease, inIcuCumulative, inIcuCurrently, onVentilatorCurrently, states FROM "national_history";'
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    dataIG = []
    for row in rows:
        # Convert date string to datetime object
        date = datetime.strptime(row[0], '%Y-%m-%d')
        dataIG.append({'date': date, 'death': row[1], 'hospitalizedIncrease': row[2], 'positiveIncrease': row[3], 'deathIncrease': row[4], 'inIcuCumulative': row[5], 'inIcuCurrently': row[6], 'onVentilatorCurrently': row[7], 'states': row[8]})
    return jsonify(dataIG)

# Starting Janki's app route

@app.route("/dataJS/<state>", methods=["GET"])
def get_state_dataJS(state):

    #date_obj = datetime.datetime.strptime(date, '%Y-%m-%d')

    conn = sqlite3.connect('clean_us_state_vaccinations.sqlite')
    cursor = conn.cursor()

    query = f'SELECT date, people_fully_vaccinated FROM "clean_vaccination" WHERE location = "{state}"'
    cursor.execute(query)
    #cursor.execute('select date, people_fully_vaccinated from clean_vaccination where location = "{state}" ')
    results = cursor.fetchall()

    cursor.close()
    conn.close()
    print(jsonify(labels=[row[0] for row in results], values=[row[1] for row in results]))
    return jsonify(labels=[row[0] for row in results], values=[row[1] for row in results])


if __name__ == '__main__':
    app.run(port=5001)