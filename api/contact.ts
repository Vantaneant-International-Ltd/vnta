import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, role, cvBase64, cvFilename } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for Resend API key
    if (!process.env.SEND_EMAIL) {
      console.error('SEND_EMAIL environment variable not set');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Limit CV size to 5MB
    if (cvBase64 && cvBase64.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'CV file too large (max 5MB)' });
    }

    let cvUrl = '';
    
    // Upload CV if provided
    if (cvBase64 && cvFilename) {
      const buffer = Buffer.from(cvBase64, 'base64');
      const timestamp = Date.now();
      const blobName = `cv-${timestamp}-${cvFilename}`;
      
      const blob = await put(blobName, buffer, {
        access: 'public',
        contentType: 'application/pdf',
      });
      
      cvUrl = blob.url;
    }

    // Send email with Resend
    const emailHtml = `
      <h3>${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Role:</strong> ${role}</p>
      ${cvUrl ? `<p><strong>CV:</strong> <a href="${cvUrl}">${cvFilename}</a></p>` : '<p><em>No CV uploaded</em></p>'}
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SEND_EMAIL}`,
      },
      body: JSON.stringify({
        from: 'noreply@vnta.xyz',
        to: 'studio@vnta.xyz',
        subject: `New Enquiry: ${role}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend error (status:', response.status, '):', errorText);
      throw new Error(`Resend API failed: ${response.status} - ${errorText}`);
    }

    res.status(200).json({ success: true, cvUrl });
  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to submit application', details: error instanceof Error ? error.message : String(error) });
  }
}
