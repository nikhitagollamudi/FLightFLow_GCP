from flask import Flask, jsonify, request
from flask_cors import CORS  # To handle CORS issues
from google.cloud import bigquery
import os
import praw
from dotenv import load_dotenv

app = Flask(__name__)

# Enable CORS for handling requests from React frontend
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Initialize BigQuery Client
client = bigquery.Client()

# Reddit API Client Setup (PRAW)
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

# Fetch list of airports from the dataset
@app.route('/api/airports', methods=['GET'])
def get_airports():
    query = """
    SELECT DISTINCT airport_name FROM `fa24-i535-hkonjeti-finalprj.flight_delay.Flights_data_delay`;
    """
    try:
        query_job = client.query(query)
        results = query_job.result()
        airports = [row['airport_name'] for row in results]
        return jsonify(airports)
    except Exception as e:
        print(f"Error fetching airports: {e}")
        return jsonify({"error": "Error fetching airport data"}), 500

# Fetch list of carriers from the dataset
@app.route('/api/carriers', methods=['GET'])
def get_carriers():
    query = """
    SELECT DISTINCT carrier_name FROM `fa24-i535-hkonjeti-finalprj.flight_delay.Flights_data_delay`;
    """
    try:
        query_job = client.query(query)
        results = query_job.result()
        carriers = [row['carrier_name'] for row in results]
        return jsonify(carriers)
    except Exception as e:
        print(f"Error fetching carriers: {e}")
        return jsonify({"error": "Error fetching carrier data"}), 500

# Fetch list of years from the dataset
@app.route('/api/years', methods=['GET'])
def get_years():
    query = """
    SELECT DISTINCT year FROM `fa24-i535-hkonjeti-finalprj.flight_delay.Flights_data_delay`;
    """
    try:
        query_job = client.query(query)
        results = query_job.result()
        years = [row['year'] for row in results]
        return jsonify(years)
    except Exception as e:
        print(f"Error fetching years: {e}")
        return jsonify({"error": "Error fetching year data"}), 500

# Fetch delay data for a combination of airport, carrier, and year from BigQuery
@app.route('/api/delay_comparison', methods=['GET'])
def get_delay_comparison():
    airport = request.args.get('airport')
    carrier = request.args.get('carrier')
    year = request.args.get('year')

    # Ensure all required parameters are provided
    if not airport or not carrier or not year:
        return jsonify({"error": "Missing required parameters (airport, carrier, year)"}), 400

    query = f"""
    SELECT month, 
           AVG(carrier_delay) AS carrier_delay, 
           AVG(weather_delay) AS weather_delay, 
           AVG(nas_delay) AS nas_delay, 
           AVG(security_delay) AS security_delay, 
           AVG(late_aircraft_delay) AS late_aircraft_delay
    FROM `fa24-i535-hkonjeti-finalprj.flight_delay.Flights_data_delay`
    WHERE airport_name = '{airport}' 
          AND carrier_name = '{carrier}' 
          AND year = {year}
    GROUP BY month
    ORDER BY month;
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        delay_data = [dict(row) for row in results]
        return jsonify(delay_data)
    except Exception as e:
        print(f"Error fetching delay data: {e}")
        return jsonify({"error": "Error fetching delay comparison data"}), 500

# Fetch Reddit opinions related to the selected airport, carrier, and year
@app.route('/api/reddit', methods=['GET'])
def get_reddit_data():
    airport = request.args.get('airport')
    carrier = request.args.get('carrier')
    year = request.args.get('year')
    delay_reason = request.args.get('delay_reason')

    # Ensure the required parameters are present
    if not airport or not carrier or not year or not delay_reason:
        return jsonify({"error": "Missing required parameters (airport, carrier, year, delay_reason)"}), 400

    search_query = f"{airport} {carrier} {year} {delay_reason} flight delay"
    
    try:
        posts = reddit.subreddit("aviation").search(search_query, limit=5)
        reddit_posts = [{
            'title': post.title,
            'url': post.url,
            'score': post.score,
            'author': post.author.name if post.author else 'N/A',
            'created_at': post.created_utc
        } for post in posts]
        return jsonify(reddit_posts)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to fetch Reddit posts"}), 500

# Run the Flask app
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Default to 8080 if PORT is not set
    app.run(host="0.0.0.0", port=port)