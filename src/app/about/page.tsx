import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1
                    className="text-4xl font-normal mb-2 tracking-tight"
                    style={{ fontFamily: "var(--font-dotGothic16)" }}
                >
                    About
                </h1>
                <p className="text-muted-foreground" style={{ fontFamily: "var(--font-onest)" }}>
                    Learn more about the project and connect with the developer.
                </p>
            </div>

            <div
                className="text-lg leading-relaxed mb-8 text-muted-foreground"
                style={{ fontFamily: "var(--font-onest)" }}
            >
                <p className="mb-6">
                    A weird Pokémon Red Randomizer with AI-powered chat functionality.
                    Play the classic game with unexpected twists and chat with an AI
                    assistant for help and fun interactions.
                </p>
            </div>

            <div
                className="space-y-4 text-sm text-muted-foreground"
                style={{ fontFamily: "var(--font-onest)" }}
            >
                <p className="text-muted-foreground" style={{ fontFamily: "var(--font-onest)" }}>
                    Follow the development and catch live streams:</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="https://www.twitch.tv/sswwiimmtv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                        </svg>
                        Twitch
                    </Link>

                    <Link
                        href="https://philippkoerber.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        Website
                    </Link>
                </div>
            </div>
        </div>
    );
} 