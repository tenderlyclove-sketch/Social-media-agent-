"use client";

import { useState } from "react";

export default function NewCampaignPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");

  function generateCampaign() {
    setResult(`
🔥 Campaign Strategy

Topic:
${topic}

Audience:
${audience}

Platform:
${platform}

Goal:
${goal}

--------------------------------

🎯 Viral Hook
"Stop scrolling! Here's what every ${audience} should know about ${topic}."

📹 Video Ideas
1. Common mistakes people make.
2. Top 5 tips.
3. Before vs After.
4. Honest review.
5. Frequently asked questions.

📝 Caption
"If you're interested in ${topic}, this is for you! Save this post and share it with a friend."

🏷 Hashtags
#AI #Marketing #ContentCreator #Viral #${platform}

📢 Call To Action
"Follow for more content and check the link in my bio!"
`);
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
          Generate Campaign
        </button>

      </div>

      {result && (
        <pre className="mt-8 whitespace-pre-wrap rounded bg-gray-100 p-4">
          {result}
        </pre>
      )}
    </main>
  );
}
