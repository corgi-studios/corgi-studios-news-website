// src/app/api/notify/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { title, slug } = await request.json();

  if (!title || !slug) {
    return NextResponse.json({ error: 'Missing title or slug' }, { status: 400 });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
  const BREVO_TEMPLATE_ID = process.env.BREVO_TEMPLATE_ID;

  if (!BREVO_API_KEY || !BREVO_LIST_ID || !BREVO_TEMPLATE_ID) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // --- New Logic for Greeting and Date ---
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17) {
    greeting = 'Good Evening';
  }

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // --- End of New Logic ---

  const postUrl = `https://news.corgistudios.tech/news/${slug}`;
  const currentYear = now.getFullYear();

  try {
    // Step 1: Create the email campaign
    const campaignResponse = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        name: `New Post - ${title}`,
        subject: `New Post: ${title}`,
        templateId: parseInt(BREVO_TEMPLATE_ID, 10),
        recipients: { listIds: [parseInt(BREVO_LIST_ID, 10)] },
        params: {
          title: title,
          url: postUrl,
          year: currentYear,
          greeting: greeting, // Send the new greeting
          date: formattedDate,   // Send the new formatted date
        },
        sender: {
            // IMPORTANT: Use an email address you have verified in Brevo
            email: "noreply@corgistudios.tech", 
            name: "Corgi Studios News"
        }
      }),
    });

    if (!campaignResponse.ok) {
      const errorData = await campaignResponse.json();
      console.error('Brevo Campaign Creation Error:', errorData);
      return NextResponse.json({ error: 'Failed to create campaign.' }, { status: 500 });
    }

    const campaignData = await campaignResponse.json();
    const campaignId = campaignData.id;

    // Step 2: Send the campaign immediately
    const sendResponse = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
      },
    });

    if (!sendResponse.ok) {
      const errorData = await sendResponse.json();
      console.error('Brevo Send Campaign Error:', errorData);
      return NextResponse.json({ error: 'Failed to send campaign.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}