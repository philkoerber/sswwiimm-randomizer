import UploadRomForm from "./UploadRomForm";
import ParameterForm from "./ParameterForm";
import { Card } from "@/components/ui/card";
import DownloadButton from "./DownloadButton";
import PlayButton from "./PlayButton";
import SupportButton from "./SupportButton";

export default function RandomizerForm() {

  return (
    <Card className="max-w-lg w-full h-fit p-6 mx-auto space-y-6">
      <section>
        <h2 className="text-3xl font-sans mb-8">1. Upload ROM</h2>
        <UploadRomForm />
      </section>

      <section>
        <h2 className="text-3xl font-sans mb-8">2. Settings</h2>
        <ParameterForm />
      </section>

      <section>
        <h2 className="text-3xl font-sans mb-8">3. Start the Emulator!</h2>
        <PlayButton />
        <h2 className="text-lg font-mono font-bold mb-1 text-center">or</h2>
        <DownloadButton />
      </section>

      <section>
        <h2 className="text-3xl font-sans mb-8">4. Support!</h2>
        <SupportButton/>
      </section>
    </Card>
  );
}
