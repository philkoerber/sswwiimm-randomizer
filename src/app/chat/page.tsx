"use client";

import { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import HotkeyConfigForm from "@/components/ui/forms/HotkeyConfigForm";
import { controllerManager } from "@/lib/controllerUtils";

// interface Message {
//     id: string;
//     text: string;
//     sender: "user" | "bot";
//     timestamp: Date;
// }

export default function ChatPage() {
    // const [messages, setMessages] = useState<Message[]>([
    //     {
    //         id: "1",
    //         text: "Hello! I'm your AI assistant. How can I help you with the Pokémon Red randomizer today?",
    //         sender: "bot",
    //         timestamp: new Date(),
    //     },
    // ]);
    // const [inputValue, setInputValue] = useState("");
    // const [isLoading, setIsLoading] = useState(false);
    const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
    const voiceChatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [hasMicPermission, setHasMicPermission] = useState(true);
    const [lastTranscription, setLastTranscription] = useState<string | null>(null);

    // console.log(messages)

    useEffect(() => {
        // Subscribe to voice chat hotkey trigger
        const unsubscribe = controllerManager.onVoiceChatTrigger(() => {
            setIsVoiceChatActive(true);
            if (voiceChatTimeoutRef.current) {
                clearTimeout(voiceChatTimeoutRef.current);
            }
            voiceChatTimeoutRef.current = setTimeout(() => {
                setIsVoiceChatActive(false);

            }, 400);
        });
        return () => {
            unsubscribe();
            if (voiceChatTimeoutRef.current) {
                clearTimeout(voiceChatTimeoutRef.current);
            }
        };
    }, []);

    // Audio recording logic
    useEffect(() => {
        let stopped = false;
        if (isVoiceChatActive) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    setHasMicPermission(true);
                    const mediaRecorder = new window.MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    audioChunksRef.current = [];
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            audioChunksRef.current.push(e.data);
                        }
                    };
                    mediaRecorder.onstop = () => {
                        stream.getTracks().forEach((track) => track.stop());
                        if (!stopped) {
                            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                            // Send audioBlob to backend
                            fetch('/api/upload-audio', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'audio/webm',
                                },
                                body: audioBlob,
                            })
                                .then(async res => {
                                    if (!res.ok) throw new Error('Failed to get TTS response');
                                    const audioArrayBuffer = await res.arrayBuffer();
                                    const audio = new Audio();
                                    const transcription = decodeURIComponent(res.headers.get('X-Transcription-Text') || '');
                                    const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });
                                    audio.src = URL.createObjectURL(audioBlob);
                                    audio.play();
                                    // Optionally, show the transcription somewhere
                                    setLastTranscription(transcription);
                                })
                                .catch(err => {
                                    console.error('Error uploading audio:', err);
                                });
                        }
                    };
                    mediaRecorder.start();
                })
                .catch((err) => {
                    setHasMicPermission(false);
                    console.error('Microphone access denied:', err);
                });
        } else {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                stopped = true;
                mediaRecorderRef.current.stop();
            }
        }
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isVoiceChatActive]);

    // const handleSendMessage = async () => {
    //     if (!inputValue.trim() || isLoading) return;
    // 
    //     const userMessage: Message = {
    //         id: Date.now().toString(),
    //         text: inputValue.trim(),
    //         sender: "user",
    //         timestamp: new Date(),
    //     };
    // 
    //     setMessages((prev) => [...prev, userMessage]);
    //     setInputValue("");
    //     setIsLoading(true);
    // 
    //     // TODO: Replace with actual API call to Node.js backend
    //     // For now, simulate a response
    //     setTimeout(() => {
    //         const botMessage: Message = {
    //             id: (Date.now() + 1).toString(),
    //             text: "This is a placeholder response. The real chatbot backend is coming soon!",
    //             sender: "bot",
    //             timestamp: new Date(),
    //         };
    //         setMessages((prev) => [...prev, botMessage]);
    //         setIsLoading(false);
    //     }, 1000);
    // };

    // const handleKeyPress = (e: React.KeyboardEvent) => {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault();
    //         handleSendMessage();
    //     }
    // };


    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl mb-2" style={{ fontFamily: "var(--font-dotGothic16)" }}>
                    Voice Chat
                </h1>
                <p className="text-muted-foreground">
                    Configure your voice chat hotkey below. Press the hotkey to activate voice chat.
                </p>
            </div>
            <div className="mb-6">
                <HotkeyConfigForm />
            </div>
            {/* Inline voice chat indicator - always visible, greyed out if not active */}
            <div className={`flex flex-col items-center justify-center py-16 transition-all duration-200 ${isVoiceChatActive ? '' : 'opacity-10 grayscale'}`}>
                <Mic className="w-24 h-24 text-primary animate-pulse mb-4" />
                <span className="text-2xl font-sans">Voice chat: Listening</span>
                {!hasMicPermission && (
                    <span className="text-red-500 mt-4">Microphone access denied. Please allow mic access.</span>
                )}
                {lastTranscription && (
                    <span className="mt-4 text-lg text-center">{lastTranscription}</span>
                )}
            </div>
        </div>
    );
} 