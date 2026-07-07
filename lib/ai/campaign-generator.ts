export type CampaignInput = {
  topic: string;
  audience: string;
  platform: string;
};

export type CampaignResult = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
};

export async function generateCampaign(
  input: CampaignInput
): Promise<CampaignResult> {
  const { topic, audience, platform } = input;

  return {
    title: `${topic} for ${platform}`,

    hook: `Stop scrolling! Here's the easiest way to master ${topic}.`,

    caption: `If you're ${audience}, this strategy can help you get better results with ${topic}. Save this post and share it with a friend.`,

    hashtags: [
      "#AI",
      "#Marketing",
      "#ContentCreator",
      "#SocialMedia",
      "#Growth",
    ],
  };
}
