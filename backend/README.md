# SSWWIIMM Randomizer Backend

A Node.js backend API for the SSWWIIMM Randomizer project, featuring a voice-to-text chatbot powered by LlamaIndex that can analyze pre-loaded CSV data.

## Features

- **Voice-to-Text Integration**: Receives transcribed voice queries from the frontend
- **LlamaIndex Integration**: AI-powered chatbot using OpenAI's GPT models
- **Pre-loaded CSV Data**: Analyzes CSV files stored locally in the backend
- **Session Management**: Maintains conversation history
- **RESTful API**: Clean, documented API endpoints
- **Security**: Rate limiting, CORS, and input validation
- **Deployment Ready**: Configured for Render.com deployment

## API Endpoints

### Chat Endpoints
- `POST /api/chat/query` - Process a voice-to-text query
- `POST /api/chat/session` - Create a new chat session
- `GET /api/chat/session/:sessionId` - Get session information

### Health Endpoints
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure it:
```bash
cp .env.local .env
```

4. Edit `.env` and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

5. Add your CSV data:
```bash
# Place your CSV files in the data/csv directory
cp your-data.csv data/csv/
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `OPENAI_API_KEY` | OpenAI API key | required |
| `OPENAI_MODEL` | OpenAI model to use | gpt-3.5-turbo |
| `JWT_SECRET` | JWT secret for authentication | required |

## CSV Data Setup

Place your CSV files in the `data/csv/` directory. The backend will automatically:

1. Load the first CSV file found in the directory
2. Index it for LlamaIndex querying
3. Make it available for voice-to-text queries

**Note**: Currently loads the first CSV file found. You can modify `llamaIndexService.js` to load multiple files.

## Development

### Running Tests
```bash
npm test
```

### Code Structure

```
backend/
├── index.js                    # Main server file
├── package.json               # Dependencies and scripts
├── routes/                    # API route handlers
│   ├── chat.js               # Chat endpoints
│   └── health.js             # Health check endpoints
├── services/                  # Business logic
│   ├── chatService.js        # Chat functionality
│   └── llamaIndexService.js  # LlamaIndex integration
├── data/                      # Data storage
│   └── csv/                  # CSV files (place your data here)
└── tests/                     # Test files
    └── setup.js              # Test configuration
```

## Deployment on Render.com

### 1. Connect to GitHub

1. Go to [Render.com](https://render.com)
2. Connect your GitHub account
3. Select this repository

### 2. Create a Web Service

1. Click "New Web Service"
2. Select your repository
3. Configure the service:
   - **Name**: `sswwiimm-randomizer-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### 3. Environment Variables

Add these environment variables in Render:

- `NODE_ENV`: `production`
- `OPENAI_API_KEY`: Your OpenAI API key
- `FRONTEND_URL`: Your frontend URL
- `JWT_SECRET`: A secure random string

### 4. Deploy

Click "Create Web Service" and Render will automatically deploy your backend.

## Usage Examples

### Process a Voice-to-Text Query
```bash
curl -X POST http://localhost:3001/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the total sales for January?",
    "sessionId": "session_123"
  }'
```

### Create a Chat Session
```bash
curl -X POST http://localhost:3001/api/chat/session \
  -H "Content-Type: application/json"
```

### Get Session Information
```bash
curl -X GET http://localhost:3001/api/chat/session/session_123
```

## Frontend Integration

The frontend should:

1. **Record Voice**: Use browser APIs or external services to record audio
2. **Transcribe**: Convert audio to text (can be done in frontend or via API)
3. **Send Query**: POST the transcribed text to `/api/chat/query`
4. **Display Response**: Show the AI response to the user

Example frontend flow:
```javascript
// 1. Record voice and transcribe to text
const transcribedText = await transcribeAudio(audioBlob);

// 2. Send to backend
const response = await fetch('/api/chat/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: transcribedText,
    sessionId: currentSessionId
  })
});

// 3. Display response
const result = await response.json();
displayResponse(result.response);
```

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Cross-origin resource sharing protection
- **Input Validation**: Validates all incoming data
- **Helmet**: Security headers middleware

## Monitoring

The application includes health check endpoints for monitoring:

- `/api/health` - Basic health status
- `/api/health/ready` - Readiness for traffic
- `/api/health/live` - Liveness check

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**: Make sure your API key is valid and has sufficient credits
2. **CORS Errors**: Check that `FRONTEND_URL` is correctly set
3. **No CSV Data**: Ensure CSV files are placed in `data/csv/` directory
4. **Memory Issues**: Large CSV files may require more memory allocation

### Logs

Check the application logs for detailed error information:
```bash
tail -f logs/app.log
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 