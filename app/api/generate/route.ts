import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("BODY RECEIVED:", body);
  
  const { topic, audience, platform, goal } = body;

  console.log("TOPIC:", topic);
  console.log("AUDIENCE:", audience);
  console.log("PLATFORM:", platform);

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OpenRouter API key" },
      { status: 500 }
    );
  }
   
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  model: "openai/gpt-4.1-mini",
  max_tokens: 800,
  temperature: 0.7,
  messages: [
          {
            role: "system",
            content:
              "You are an expert social media marketing strategist who creates highly engaging campaigns.",
          },
{
  role: "user",
  content: `
                You are a world-class social media strategist.

                Return ONLY valid JSON.

                Use exactly this format:

                {
                  "title": "...",
                  "hook": "...",
                  "caption": "...",
                  "hashtags": [
                    "...",
                    "...",
                    "...",
                    "...",
                    "..."
                  ],
                  "imagePrompt": "..."
                }
               

                Campaign details:

              Topic: ${topic}
              Audience: ${audience}
              Platform: ${platform}
              Goal: ${goal}

              Rules:
              - Do not write explanations.
              - Do not use markdown.
              - Do not wrap the JSON inside triple backticks.
              - Return only valid JSON.
              - imagePrompt must be a highly detailed AI image generation prompt for a realistic, professional social media image matching the campaign.
             `,
          },
        ],
      }),
    }
  );
 
  const data = await response.json();

console.log("STATUS:", response.status);
console.log(
  "OPENROUTER RESPONSE:",
  JSON.stringify(data, null, 2)
);

if (!response.ok) {
  return NextResponse.json(
    {
      error: data,
    },
    {
      status: response.status,
    }
  );
}

const content = data.choices[0].message.content;

return NextResponse.json({
  content,
});
}
