import os
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import pandas as pd

app = Flask(__name__)

# Set up the SQLite database connection
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///covid_data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Convert all tables in the database to JSON format
@app.route("/data")
def all_data():
    tables = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
    data = {}
    for table in tables:
        table_name = table[0]
        query = f"SELECT * FROM \"{table_name}\";"
        df = pd.read_sql_query(query, db.engine)
        data[table_name] = df.to_dict(orient="records")
    return jsonify(data)

# Render the index.html page
@app.route("/")
def index():
    return render_template("index.html")

# Endpoint for fetching state data
@app.route("/state_data/<state>")
def state_data(state):
    # Query the SQLite database for the specified state's data
    state_table_name = f"{state} Aggregated"
    query = f"SELECT date, cumulative_cases FROM \"{state_table_name}\";"
    state_df = pd.read_sql_query(query, db.engine)

    # Convert the data to a list of dictionaries and return as JSON
    result = state_df.to_dict(orient="records")
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port = 5001)
