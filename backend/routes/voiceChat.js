const express = require('express');
const router = express.Router();
const multer = require('multer');
const { OpenAI } = require('openai');
const { ChatService } = require('../services/chatService');

// Configure multer for handling audio file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept audio files
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'), false);
        }
    }
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chatService = new ChatService();

// POST /api/voice-chat
// Process voice chat: transcribe audio, get response, generate speech
router.post('/', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No audio file provided'
            });
        }

        const sessionId = req.headers['x-session-id'] || null;

        // Step 1: Transcribe audio to text
        const audioFile = new File([req.file.buffer], 'audio.webm', {
            type: req.file.mimetype
        });

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
        });

        const transcribedText = transcription.text;

        // Step 2: Process the transcribed text through chat service
        const chatResponse = await chatService.processQuery(transcribedText, sessionId);
        const responseText = chatResponse.response;

        // Step 3: Generate TTS audio from the response
        const ttsResponse = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'echo',
            input: responseText,
        });

        const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

        // Return the audio with transcription and response text in headers
        res.set({
            'Content-Type': 'audio/mpeg',
            'X-Transcription-Text': encodeURIComponent(transcribedText),
            'X-Response-Text': encodeURIComponent(responseText),
        });

        res.send(audioBuffer);

    } catch (error) {
        console.error('Voice chat error:', error);

        if (error.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({
                success: false,
                error: 'Invalid file type. Only audio files are allowed.'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process voice chat'
        });
    }
});

module.exports = router; 