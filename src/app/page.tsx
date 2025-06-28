import RandomizerForm from "@/components/ui/forms/RandomizerForm";

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-normal mb-2 tracking-tight" style={{ fontFamily: "var(--font-dotGothic16)" }}>
          Randomizer
        </h1>
        <p className="text-muted-foreground" style={{ fontFamily: "var(--font-onest)" }}>
          Upload your Pokémon Red ROM and customize your randomizer experience.
        </p>
      </div>
      <RandomizerForm />
    </div>
  );
}
