// pages/api/discord-webhook.js

export default async function handler(req: {
  [x: string]: any; method: string; 
}, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success?: boolean; error?: any; }): any; new(): any; }; end: { (): any; new(): any; }; }; }) {
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL as string;

  if (req.method === 'POST') {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: req.body,
        }),
      });

      if (response.ok) {
        return res.status(200).json({ success: true });
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to send webhook: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).end();
  }
}
