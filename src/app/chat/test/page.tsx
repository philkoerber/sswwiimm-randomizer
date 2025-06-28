'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function TestPage() {
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [chatResponse, setChatResponse] = useState<any>(null);
    const [sessionId, setSessionId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<string>('');
    const [envInfo, setEnvInfo] = useState<any>({});

    // Load environment info on component mount
    useEffect(() => {
        loadEnvInfo();
    }, []);

    const loadEnvInfo = async () => {
        try {
            const response = await fetch('/api/test-backend?action=env');
            const data = await response.json();
            setEnvInfo(data);
        } catch (error) {
            setEnvInfo({ error: (error as any).message });
        }
    };

    const testHealth = async () => {
        setLoading('health');
        try {
            const response = await fetch('/api/test-backend?action=health');
            const data = await response.json();
            setHealthStatus(data);
        } catch (error) {
            setHealthStatus({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    const testHealthReady = async () => {
        setLoading('ready');
        try {
            const response = await fetch('/api/test-backend?action=ready');
            const data = await response.json();
            setHealthStatus(data);
        } catch (error) {
            setHealthStatus({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    const testHealthLive = async () => {
        setLoading('live');
        try {
            const response = await fetch('/api/test-backend?action=live');
            const data = await response.json();
            setHealthStatus(data);
        } catch (error) {
            setHealthStatus({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    const createSession = async () => {
        setLoading('session');
        try {
            const response = await fetch('/api/test-backend?action=create-session', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                setSessionId(data.sessionId);
                setChatResponse(data);
            } else {
                setChatResponse(data);
            }
        } catch (error) {
            setChatResponse({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    const getSession = async () => {
        if (!sessionId) {
            setChatResponse({ error: 'Please create a session first' });
            return;
        }
        setLoading('getSession');
        try {
            const response = await fetch(`/api/test-backend?action=session&sessionId=${sessionId}`);
            const data = await response.json();
            setChatResponse(data);
        } catch (error) {
            setChatResponse({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) {
            setChatResponse({ error: 'Please enter a message' });
            return;
        }
        setLoading('message');
        try {
            const response = await fetch('/api/test-backend?action=send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    sessionId: sessionId || undefined,
                }),
            });
            const data = await response.json();
            setChatResponse(data);
            setMessage('');
        } catch (error) {
            setChatResponse({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    const testRootEndpoint = async () => {
        setLoading('root');
        try {
            const response = await fetch('/api/test-backend?action=root');
            const data = await response.json();
            setHealthStatus(data);
        } catch (error) {
            setHealthStatus({ error: (error as any).message });
        } finally {
            setLoading('');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl mb-2" style={{ fontFamily: "var(--font-dotGothic16)" }}>
                    Backend Test Page
                </h1>
                <p className="text-muted-foreground">Hidden page for testing backend endpoints via API route</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Tests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Health Endpoints</CardTitle>
                        <CardDescription>Test backend health and status endpoints</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={testRootEndpoint}
                                disabled={loading === 'root'}
                                variant="outline"
                            >
                                {loading === 'root' ? 'Testing...' : 'Test Root'}
                            </Button>
                            <Button
                                onClick={testHealth}
                                disabled={loading === 'health'}
                                variant="outline"
                            >
                                {loading === 'health' ? 'Testing...' : 'Test Health'}
                            </Button>
                            <Button
                                onClick={testHealthReady}
                                disabled={loading === 'ready'}
                                variant="outline"
                            >
                                {loading === 'ready' ? 'Testing...' : 'Test Ready'}
                            </Button>
                            <Button
                                onClick={testHealthLive}
                                disabled={loading === 'live'}
                                variant="outline"
                            >
                                {loading === 'live' ? 'Testing...' : 'Test Live'}
                            </Button>
                        </div>

                        {healthStatus && (
                            <div className="mt-4">
                                <Label>Response:</Label>
                                <pre className="mt-2 p-3 bg-muted rounded-md text-sm overflow-auto max-h-40">
                                    {JSON.stringify(healthStatus, null, 2)}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chat Tests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chat Endpoints</CardTitle>
                        <CardDescription>Test chat session and message functionality</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={createSession}
                                disabled={loading === 'session'}
                                variant="outline"
                            >
                                {loading === 'session' ? 'Creating...' : 'Create Session'}
                            </Button>
                            <Button
                                onClick={getSession}
                                disabled={loading === 'getSession'}
                                variant="outline"
                            >
                                {loading === 'getSession' ? 'Loading...' : 'Get Session'}
                            </Button>
                        </div>

                        {sessionId && (
                            <div className="mt-4">
                                <Label>Session ID:</Label>
                                <Input
                                    value={sessionId}
                                    readOnly
                                    className="mt-1 font-mono text-sm"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="message">Test Message:</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e: any) => setMessage(e.target.value)}
                                placeholder="Enter a test message..."
                                className="min-h-[80px]"
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={loading === 'message' || !message.trim()}
                                className="w-full"
                            >
                                {loading === 'message' ? 'Sending...' : 'Send Message'}
                            </Button>
                        </div>

                        {chatResponse && (
                            <div className="mt-4">
                                <Label>Response:</Label>
                                <pre className="mt-2 p-3 bg-muted rounded-md text-sm overflow-auto max-h-40">
                                    {JSON.stringify(chatResponse, null, 2)}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Backend Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Backend Information</CardTitle>
                    <CardDescription>Current backend configuration and environment details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <Label>Environment:</Label>
                            <p className="font-mono">{envInfo.nodeEnv}</p>
                        </div>
                        <div>
                            <Label>Backend URL:</Label>
                            <p className="font-mono">{envInfo.backendUrl || 'Not configured'}</p>
                        </div>
                        <div>
                            <Label>Environment Variables:</Label>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>BACKEND_URL: {envInfo.backendUrl || 'Not set'}</li>
                                <li>NODE_ENV: {envInfo.nodeEnv || 'Not set'}</li>
                            </ul>
                        </div>
                        <div>
                            <Label>Configuration:</Label>
                            <div className="text-xs space-y-1">
                                <p><strong>Backend URL:</strong> Set BACKEND_URL environment variable</p>
                                <p><strong>Note:</strong> All requests go through /api/test-backend</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-md">
                        <Label className="text-sm font-semibold">Available API Endpoints:</Label>
                        <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                            <li>GET /api/test-backend?action=health - Health check</li>
                            <li>GET /api/test-backend?action=ready - Readiness check</li>
                            <li>GET /api/test-backend?action=live - Liveness check</li>
                            <li>GET /api/test-backend?action=root - Root endpoint</li>
                            <li>GET /api/test-backend?action=env - Environment info</li>
                            <li>POST /api/test-backend?action=create-session - Create session</li>
                            <li>GET /api/test-backend?action=session&sessionId=:id - Get session</li>
                            <li>POST /api/test-backend?action=send-message - Send message</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 