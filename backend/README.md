# SSWWIIMM Randomizer Backend

A Node.js backend API for the SSWWIIMM Randomizer project, featuring a voice-to-text chatbot powered by OpenAI and LlamaIndex that can analyze pre-loaded CSV data.

## 🎤 Features

- **Voice-to-Text Integration**: Real-time speech recognition using OpenAI Whisper
- **Text-to-Speech**: Natural voice responses using OpenAI TTS
- **AI-Powered Chat**: LlamaIndex integration with OpenAI GPT models
- **Pokémon Name Correction**: Automatic correction of speech recognition errors
- **Pre-loaded CSV Data**: Analyzes Pokémon and move data stored locally
- **Session Management**: Maintains conversation history and context
- **RESTful API**: Clean, documented API endpoints
- **Security**: Rate limiting, CORS, and input validation
- **Deployment Ready**: Configured for Render.com deployment

## 🚀 Performance & Optimization

### Current Implementation
The voice chat pipeline consists of three sequential API calls:
1. **Speech-to-Text** (OpenAI Whisper) - ~1-2 seconds
2. **Chat Processing** (OpenAI GPT + LlamaIndex) - ~1-3 seconds  
3. **Text-to-Speech** (OpenAI TTS) - ~1-2 seconds

**Total latency**: ~3-7 seconds per voice interaction

### Future Local Processing Options

#### Local Speech-to-Text
- **Whisper.cpp** (Recommended): Same accuracy as OpenAI Whisper, 2-5x faster
- **Vosk**: Completely offline, real-time processing
- **Coqui STT**: Open-source alternative with good accuracy

#### Local Text-to-Speech
- **Coqui TTS** (Recommended): High-quality voices, 3-5x faster
- **eSpeak**: Lightweight, extremely fast (robotic quality)
- **Festival**: Good quality, customizable voices

#### Expected Performance Improvements
- **Local STT + Local TTS**: 5-10x faster (~200-500ms total)
- **Local STT + API TTS**: 3-5x faster (~1-2 seconds total)
- **API STT + Local TTS**: 2-3x faster (~2-3 seconds total)

## 📊 API Endpoints

### Chat Endpoints
- `POST /api/chat/query` - Process a text query
- `POST /api/chat/session` - Create a new chat session
- `GET /api/chat/session/:sessionId` - Get session information

### Voice Chat Endpoints
- `POST /api/voice-chat` - Process voice chat (audio input → transcription → response → speech output)

### Health Endpoints
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

## 🏗️ Architecture

```
Voice Chat Pipeline:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Audio Input │ -> │ OpenAI      │ -> │ Chat        │ -> │ OpenAI      │
│ (WebM)      │    │ Whisper     │    │ Service     │    │ TTS         │
└─────────────┘    │ (STT)       │    │ (GPT +      │    │ (Speech)    │
                   └─────────────┘    │  LlamaIndex)│    └─────────────┘
                                      └─────────────┘
```

### Core Services
- **ChatService**: Orchestrates the voice chat pipeline
- **LLMService**: Handles OpenAI API interactions
- **DataService**: Manages CSV data loading and querying
- **SessionManager**: Maintains conversation context
- **PokemonNameCorrector**: Fixes speech recognition errors

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- ~6GB RAM (for future local processing)
- ~3GB disk space (for models)

### Installation

1. **Clone the repository and navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Copy the environment file and configure it:**
```bash
cp .env.local .env
```

4. **Edit `.env` and add your OpenAI API key:**
```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

5. **Add your CSV data:**
```bash
# Place your CSV files in the data/csv directory
cp your-data.csv data/csv/
```

6. **Start the development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | 900000 (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |

## 📁 Project Structure

```
backend/
├── data/
│   ├── contexts/          # LlamaIndex context files
│   └── csv/              # Pokémon and move data
├── logs/                 # Application logs
├── routes/               # API route handlers
│   ├── chat.js          # Chat endpoints
│   ├── health.js        # Health check endpoints
│   └── voiceChat.js     # Voice chat endpoint
├── services/            # Business logic services
│   ├── chatService.js   # Main chat orchestration
│   ├── core/           # Core services
│   │   ├── DataService.js
│   │   └── LLMService.js
│   ├── llamaIndexService.js
│   ├── processors/     # Data processors
│   │   ├── PokemonNameCorrector.js
│   │   └── QueryProcessor.js
│   └── session/        # Session management
│       └── SessionManager.js
├── uploads/            # File uploads
└── index.js           # Main server file
```

## 🎯 Usage Examples

### Process a Voice-to-Text Query
```bash
curl -X POST http://localhost:3001/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are Pikachu's stats?",
    "sessionId": "session_123"
  }'
```

### Process Voice Chat (Audio Input)
```bash
curl -X POST http://localhost:3001/api/voice-chat \
  -H "X-Session-Id: session_123" \
  -F "audio=@recording.webm"
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

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Cross-origin resource sharing protection
- **Input Validation**: Validates all incoming data
- **Helmet**: Security headers middleware
- **File Upload Limits**: 10MB max for audio files

## 📈 Monitoring

The application includes health check endpoints for monitoring:

- `/api/health` - Basic health status
- `/api/health/ready` - Readiness check (checks dependencies)
- `/api/health/live` - Liveness check (checks if app is running)

## 🚀 Deployment

### Render.com Deployment

1. **Connect your repository** to Render
2. **Create a new Web Service**
3. **Configure environment variables:**
   - `NODE_ENV`: production
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: Your frontend URL
   - `JWT_SECRET`: A secure random string

4. **Deploy** - Render will automatically deploy your backend

### Environment Variables for Production
```bash
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=your_secure_jwt_secret
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🔮 Future Enhancements

### Local Processing Implementation
1. **Phase 1**: Implement Whisper.cpp for local STT
2. **Phase 2**: Add Coqui TTS for local speech synthesis
3. **Phase 3**: Optimize audio pipeline and add caching

### Performance Optimizations
- **Model Caching**: Cache downloaded models locally
- **Parallel Processing**: Process STT and TTS in parallel where possible
- **Audio Optimization**: Optimize audio formats for faster processing
- **Response Caching**: Cache common responses

### Additional Features
- **Voice Customization**: Allow users to choose different TTS voices
- **Language Support**: Add support for multiple languages
- **Offline Mode**: Full offline functionality with local models
- **Real-time Streaming**: Stream audio responses for faster feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 