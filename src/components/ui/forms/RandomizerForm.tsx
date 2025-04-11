import UploadRomForm from "./UploadRomForm";
import ParameterForm from "./ParameterForm";
import { Card } from "@/components/ui/card";

export default function RandomizerForm() {
  return (
    <Card className="max-w-2xl w-full p-6 mx-auto space-y-10">
      <section>
        <h2 className="text-3xl font-sans mb-8">1. Upload ROM</h2>
        <UploadRomForm />
      </section>

      <section>
        <h2 className="text-3xl font-sans mb-8">2. Settings</h2>
        <ParameterForm />
      </section>

      {/* Submit button can go here later */}
    </Card>
  );
}