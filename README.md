# Flight Flow Analysis: Exploring Airline Delays Through Data and Public Opinion  

## Overview  
This project analyzes U.S. airline delays to uncover trends, identify causes, and provide actionable insights for improving airline operations and passenger experiences. By integrating structured datasets from the Bureau of Transportation Statistics with unstructured feedback from Reddit, the project adds a qualitative dimension to the quantitative analysis.  

The analysis pipeline leverages Google Cloud Platform (GCP) for scalable data processing and storage, and features an interactive React dashboard for visualizing delay trends and patterns.  

## Features  
- **Big Data Pipeline**: Processes 500,000+ flight records to analyze delay trends by airline, airport, and cause.  
- **Multi-Source Integration**: Combines structured data with real-time Reddit feedback via API for enriched insights.  
- **Interactive Dashboard**: Visualizes delay patterns with dynamic filtering by airline, airport, and delay cause.  
- **Cloud-Native Deployment**: Backend hosted on Google App Engine, frontend deployed on Vercel.  
- **Comprehensive Visualizations**: Includes monthly, yearly, and cause-specific delay trends.  

## Technology Stack  
- **Cloud Platform**: Google Cloud Platform (BigQuery, App Engine, Cloud Storage)  
- **Backend**: Flask  
- **Frontend**: React  
- **Database**: BigQuery  
- **APIs**: Reddit API (via `praw`)  

## Installation and Setup  

### Prerequisites  
- Python 3.x  
- Node.js 18.x  
- Google Cloud Platform account  

### Clone the Repository  
```bash  
git clone https://github.com/hkonjeti3/Flight-flow.git  
cd Flight-flow  
```  

### Backend Setup  
1. Install Python dependencies:  
   ```bash  
   pip install -r requirements.txt  
   ```  
2. Configure GCP authentication:  
   ```bash  
   gcloud auth login  
   gcloud config set project [YOUR_PROJECT_ID]  
   ```  
3. Deploy the Flask backend:  
   ```bash  
   gcloud app deploy  
   ```  

### Frontend Setup  
1. Navigate to the frontend folder:  
   ```bash  
   cd frontend  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Deploy the React frontend on Vercel:  
   ```bash  
   vercel deploy  
   ```  

## Usage  
- Access the dashboard to explore flight delay trends and causes.  
- Use dynamic filters to analyze delays by airline, airport, or specific causes (e.g., weather or late aircraft).  
- View real-time feedback from Reddit for additional context on delays.  

## Results  
- **Key Insights**:  
  - Seasonal peaks in delays, with weather-related delays frequent in winter months.  
  - Operational inefficiencies highlighted by late aircraft delays at major hubs.  
  - Real-time feedback from Reddit provides qualitative insights into passenger experiences.  
- **Interactive Visualizations**:  
  - Monthly and yearly delay trends.  
  - Comparison of delays across airlines and airports.  
 

## Demo  
- **Frontend**: [Flight Flow Dashboard](https://flight-flow.vercel.app/)  
- **GitHub Repository**: [Source Code](https://github.com/hkonjeti3/Flight-flow)  
