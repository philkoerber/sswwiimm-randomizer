import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;
        const sessionId = req.headers.get('X-Session-Id');

        if (!audioFile) {
            return NextResponse.json({
                success: false,
                error: 'No audio file provided'
            }, { status: 400 });
        }

        // Create new FormData for backend
        const backendFormData = new FormData();
        backendFormData.append('audio', audioFile);

        // Forward the request to the backend
        const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/voice-chat`, {
            method: 'POST',
            headers: {
                'X-Session-Id': sessionId || '',
            },
            body: backendFormData,
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `Backend request failed: ${backendResponse.statusText}`);
        }

        // Get the audio buffer from backend
        const audioArrayBuffer = await backendResponse.arrayBuffer();
        const audioBuffer = Buffer.from(audioArrayBuffer);

        // Get headers from backend response
        const transcriptionText = backendResponse.headers.get('X-Transcription-Text');
        const responseText = backendResponse.headers.get('X-Response-Text');

        // Return the audio with the same headers
        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'X-Transcription-Text': transcriptionText || '',
                'X-Response-Text': responseText || '',
            },
        });

    } catch (error) {
        console.error('Voice chat proxy error:', error);

        if (error instanceof Error) {
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 500 });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Unknown error'
            }, { status: 500 });
        }
    }
} 