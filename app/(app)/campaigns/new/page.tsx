"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { generateCampaign as aiGenerateCampaign } from "@/lib/ai/campaign-generator";
export default function NewCampaignPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const campaign: any = result ? JSON.parse(result) : null;  

function copyCampaign() {
  if (!campaign) return;

  const text = `
🚀 ${campaign.title}

🎣 Hook
${campaign.hook}

✍️ Caption
${campaign.caption}

#️⃣ Hashtags
${campaign.hashtags.join(" ")}
`;

  navigator.clipboard.writeText(text);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
}

  function downloadCampaign() {
    if (!campaign) return;

    const text = `
    🚀 ${campaign.title}

    🎣 Hook
    ${campaign.hook}

    ✍️ Caption
    ${campaign.caption}

    #️⃣ Hashtags
    ${campaign.hashtags.join(" ")}
    `;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "campaign.txt";
    a.click();

    URL.revokeObjectURL(url);
  }
  async function generateCampaign() {
    try {
  setLoading(true);   
 const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        audience,
        platform,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      setLoading(false);    
      alert(data.error || "Request failed");
      return;
    }

      setResult(JSON.stringify(JSON.parse(data.content), null, 2));
      setLoading(false);

  } catch (err) {
    console.error(err);
    setLoading(false);    
    alert("Network error");
  }
}

return (
   <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        🚀 New AI Campaign
      </h1>

      <div className="space-y-4">

        <input
          className="w-full border rounded p-3"
          placeholder="Topic or Product"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          className="w-full border rounded p-3"
          placeholder="Target Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <input
          className="w-full border rounded p-3"
          placeholder="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />

        <input
          className="w-full border rounded p-3"
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

<button
  onClick={generateCampaign}
  className="bg-blue-600 text-white px-6 py-3 rounded"
>
  {loading ? "Generating..." : "Generate Campaign"}          
</button>

      </div>

      {result && (
  <Card className="mt-8">
    <CardHeader>
      <CardTitle>🤖 AI Campaign Result</CardTitle>
    </CardHeader>

  <CardContent>
 <div className="whitespace-pre-wrap leading-8 text-base font-medium">
  <>
    <h3 className="text-xl font-bold mb-4">
      🚀 {campaign.title}
    </h3>

    <div className="mb-6">
      <h4 className="font-semibold">
        🎣 Hook
      </h4>
      <p>{campaign.hook}</p>
    </div>
   
  <div className="mb-6">
    <h4 className="font-semibold">
      ✍️ Caption
    </h4>
    <p>{campaign.caption}</p>
  </div>

  <div>
    <h4 className="font-semibold">
      #️⃣ Hashtags
    </h4>

    <div className="flex flex-wrap gap-2 mt-2">
      {campaign.hashtags.map((tag: string) => (
        <span
          key={tag}
          className="bg-blue-600 text-white px-2 py-1 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
   
    <div className="mb-6">
      <h4 className="font-semibold">
        🖼 AI Image Prompt
      </h4>
      <p>{campaign.imagePrompt}</p>
    </div>

    <div className="mt-8 flex justify-end">

  <button
    onClick={downloadCampaign}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition mr-3"
  >
    ⬇ Download TXT
  </button>

  <button
    onClick={copyCampaign}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
  >
    {copied ? "✅ Copied!" : "📋 Copy Campaign"}
  </button>    
  </div>
 
  </>
   </div>
  </CardContent>
  </Card>
      )}
    </main>
  );
}
