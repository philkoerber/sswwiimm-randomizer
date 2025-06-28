# sswwiimm RANDOMIZER

> 🧬 The weirdest Pokémon Red randomizer you've ever seen — now playable in the browser with AI-powered voice chat!

## 🕹 Features

- 🎲 Randomizes starters, found items, and more
- ⚙️ Adjustable difficulty & weirdness settings
- 🧠 Built with React + Zustand + TailwindCSS
- 🎮 Live GameBoy emulator (WasmBoy)
- 📥 Download or play your modified ROM instantly
- 🎤 **Voice Chat with AI Assistant** - Ask questions about Pokémon, moves, and game mechanics
- 💬 Real-time chatbot powered by Node.js & OpenAI
- 🎯 Pokémon name correction for speech-to-text accuracy

## 🚀 Live Demo

[https://sswwiimm-randomizer.vercel.app](https://sswwiimm-randomizer.vercel.app)

## 📦 Tech Stack

### Frontend
- `Next.js` (App Router)
- `TailwindCSS` & `tailwind-merge`
- `Radix UI` for accessible components
- `Zustand` for global state
- `WasmBoy` for in-browser GameBoy emulation
- `TypeScript` for strong typing

### Backend
- `Node.js` with Express
- `OpenAI API` for speech-to-text (Whisper) and text-to-speech
- `LlamaIndex` for AI-powered CSV data analysis
- `Session management` for conversation history
- `Pokémon name correction` for improved speech recognition

## 🎤 Voice Chat Features

The app now includes a fully functional voice chat system that allows you to:

- **Ask questions about Pokémon**: "What are Pikachu's stats?" or "How do I evolve Charmander?"
- **Query move information**: "What does Thunderbolt do?" or "What type is Flamethrower?"
- **Get game mechanics help**: "How do I catch Pokémon?" or "What are the starter Pokémon?"
- **Natural conversation**: The AI maintains context across multiple questions

### Voice Chat Setup
1. Configure your voice chat hotkey in the chat page
2. Press the hotkey to start recording
3. Speak your question clearly
4. The AI will transcribe, process, and respond with voice

### Performance Optimization
The voice chat system is designed for speed and accuracy:
- **Speech-to-Text**: OpenAI Whisper for high accuracy
- **Text-to-Speech**: OpenAI TTS for natural voice quality
- **Pokémon Name Correction**: Automatic correction of common speech recognition errors
- **Session Management**: Maintains conversation context

### Future Local Processing
Plans are in place to implement local processing for even faster response times:
- **Local STT**: Whisper.cpp or Vosk for offline speech recognition
- **Local TTS**: Coqui TTS or eSpeak for offline text-to-speech
- **Expected speedup**: 5-10x faster response times

## 🏗️ Project Structure

```
sswwiimm-randomizer/
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   └── lib/              # Utilities and state
├── backend/               # Node.js API server
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── data/            # CSV data and contexts
└── pokered lab/          # Pokémon Red disassembly (research)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key (for voice chat features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sswwiimm-randomizer.git
cd sswwiimm-randomizer
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up environment variables**
```bash
# In backend directory
cp .env.local .env
# Add your OpenAI API key to .env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

5. **Start the development servers**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 🎮 Usage

1. **Randomize Pokémon Red**: Use the main interface to customize your randomizer settings
2. **Play in Browser**: Use the built-in GameBoy emulator to play your randomized ROM
3. **Voice Chat**: Navigate to the chat page to interact with the AI assistant
4. **Download ROM**: Save your randomized ROM for use in other emulators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **pret/pokered**: For the amazing Pokémon Red disassembly (included for research)
- **WasmBoy**: For the in-browser GameBoy emulation
- **OpenAI**: For speech-to-text and text-to-speech capabilities
- **LlamaIndex**: For AI-powered data analysis

---

*Note: The pokered lab directory contains the Pokémon Red disassembly for research purposes only. This is an amazing project by the pret team - thank you for making this possible!*