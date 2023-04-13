from flask import Flask, jsonify, request
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)

# Connect to the SQLite database
engine = create_engine("sqlite:///covid.sqlite")

@app.route('/api/top_cases', methods=['GET'])
def top_cases():
    date = request.args.get('date', type=int)
    
    if not date:
        return jsonify({'error': 'Date parameter is missing or invalid'}), 400

    query = f"""
    SELECT state, cases
    FROM (
        SELECT state, SUM(cases) as cases
        FROM "daily_cases_by_state"
        WHERE date = {date}
        GROUP BY state
    )
    ORDER BY cases DESC
    LIMIT 10
    """

    result = pd.read_sql_query(query, con=engine)
    result_json = result.to_json(orient='records')

    return result_json

if __name__ == '__main__':
    app.run(debug=True, port=5001)
