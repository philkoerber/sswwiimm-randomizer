import { NextRequest, NextResponse } from 'next/server';

// Type definitions
interface ApiResponse {
    [key: string]: unknown;
}

interface ErrorResponse {
    error: string;
}

interface HealthResponse {
    status: string;
    timestamp: string;
    environment?: string;
    [key: string]: unknown;
}

interface SessionResponse {
    success: boolean;
    sessionId?: string;
    message?: string;
    [key: string]: unknown;
}

interface EnvInfo {
    nodeEnv: string;
    backendUrl?: string;
}

// Backend URL configuration
const getBackendUrl = (): string | undefined => {
    return process.env.BACKEND_URL;
};

// Health check endpoints
const testHealth = async (backendUrl: string): Promise<HealthResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/api/health`);
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

const testHealthReady = async (backendUrl: string): Promise<HealthResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/api/health/ready`);
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

const testHealthLive = async (backendUrl: string): Promise<HealthResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/api/health/live`);
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

const testRootEndpoint = async (backendUrl: string): Promise<ApiResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/`);
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

// Chat session endpoints
const createSession = async (backendUrl: string): Promise<SessionResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/api/chat/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

const getSession = async (backendUrl: string, sessionId: string): Promise<ApiResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/api/chat/session/${sessionId}`);
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

const sendMessage = async (backendUrl: string, message: string, sessionId?: string): Promise<ApiResponse | ErrorResponse> => {
    try {
        const response = await fetch(`${backendUrl}/api/chat/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message.trim(),
                sessionId: sessionId || undefined,
            }),
        });
        return await response.json();
    } catch (error) {
        return { error: (error as Error).message };
    }
};

// Get environment information
const getEnvInfo = (): EnvInfo => {
    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        backendUrl: getBackendUrl(),
    };
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const backendUrl = getBackendUrl();
    if (!backendUrl) {
        return NextResponse.json({ error: 'BACKEND_URL environment variable is not set' });
    }

    switch (action) {
        case 'health':
            const healthResult = await testHealth(backendUrl);
            return NextResponse.json(healthResult);

        case 'ready':
            const readyResult = await testHealthReady(backendUrl);
            return NextResponse.json(readyResult);

        case 'live':
            const liveResult = await testHealthLive(backendUrl);
            return NextResponse.json(liveResult);

        case 'root':
            const rootResult = await testRootEndpoint(backendUrl);
            return NextResponse.json(rootResult);

        case 'session':
            const sessionId = searchParams.get('sessionId');
            if (!sessionId) {
                return NextResponse.json({ error: 'Session ID is required' });
            }
            const sessionResult = await getSession(backendUrl, sessionId);
            return NextResponse.json(sessionResult);

        case 'env':
            const envInfo = getEnvInfo();
            return NextResponse.json(envInfo);

        default:
            return NextResponse.json({ error: 'Invalid action' });
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const backendUrl = getBackendUrl();
    if (!backendUrl) {
        return NextResponse.json({ error: 'BACKEND_URL environment variable is not set' });
    }

    switch (action) {
        case 'create-session':
            const sessionResult = await createSession(backendUrl);
            return NextResponse.json(sessionResult);

        case 'send-message':
            const body = await req.json();
            const { message, sessionId } = body;

            if (!message || !message.trim()) {
                return NextResponse.json({ error: 'Message is required' });
            }

            const messageResult = await sendMessage(backendUrl, message, sessionId);
            return NextResponse.json(messageResult);

        default:
            return NextResponse.json({ error: 'Invalid action' });
    }
} 