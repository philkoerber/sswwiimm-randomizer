"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import HotkeyConfigForm from "@/components/ui/forms/HotkeyConfigForm";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm your AI assistant. How can I help you with the Pokémon Red randomizer today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // TODO: Replace with actual API call to Node.js backend
        // For now, simulate a response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "This is a placeholder response. The real chatbot backend is coming soon!",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-dotGothic16)" }}>
                    AI Chat Assistant
                </h1>
                <p className="text-muted-foreground">
                    Ask me anything about the Pokémon Red randomizer, get help with settings, or just chat!
                </p>
            </div>

            {/* Hotkey Configuration - Always Visible */}
            <div className="mb-6">
                <HotkeyConfigForm />
            </div>

            <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Chat Assistant
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className="flex gap-3 max-w-[80%]">
                                    {message.sender === "bot" && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={`p-3 rounded-lg ${message.sender === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted/50 border"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <p className="text-xs opacity-70 mt-2">
                                            {message.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    {message.sender === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="bg-muted/50 border p-3 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                size="icon"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>💬 Real-time chatbot powered by Node.js & Llama coming soon!</p>
                <p className="mt-1">🎮 Configure voice chat hotkeys above</p>
            </div>
        </div>
    );
} 