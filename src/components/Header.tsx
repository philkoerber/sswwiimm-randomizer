import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-muted bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-dotGothic16)" }}>
          s?w´I|▒▒▒MM<span className="text-primary">R▒ÑD▒MIZer´´Я</span>
        </Link>

        <nav className="text-sm text-muted-foreground space-x-4 hidden sm:block" style={{ fontFamily: "var(--font-onest)" }}>
          <Link href="/" className="hover:text-primary transition">Randomizer</Link>
          <Link href="/chat" className="hover:text-primary transition">Chat</Link>
          <Link href="/about" className="hover:text-primary transition">About</Link>
        </nav>
      </div>
    </header>
  );
}