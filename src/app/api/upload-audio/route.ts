import { NextRequest, NextResponse } from 'next/server';
import { OpenAI, APIError } from 'openai';

// If running on Node.js < 20, you may need to import File from 'undici'
// import { File } from 'undici';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export async function POST(req: NextRequest) {
    const data = await req.arrayBuffer();
    const buffer = Buffer.from(data);

    // Create a File object (Node.js 18+)
    const audioFile = new File([buffer], 'audio.webm', { type: 'audio/webm' });

    try {
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
        });

        return NextResponse.json({ success: true, text: transcription.text });
    } catch (error: unknown) {
        if (error instanceof APIError) {
            console.error('Transcription error:', error);
            return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
        } else if (error instanceof Error) {
            console.error('Transcription error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            console.error('Transcription error:', error);
            return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
        }
    }
} 