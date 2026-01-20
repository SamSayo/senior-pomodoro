"server-side"

import { NextRequest } from 'next/server';
import webPush from 'web-push';

webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:example@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { subscription, payload } = await request.json();

    await webPush.sendNotification(subscription, payload);

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Push error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}