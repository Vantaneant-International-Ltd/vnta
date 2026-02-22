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
    const {
      name,
      email,
      role_id,
      role_title,
      subject,
      location,
      links,
      lane,
      vendr_lane,
      vendr_examples,
      pitch,
      cvBase64,
      cvFilename,
    } = req.body;

    if (!name || !email || !role_title) {
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

      // Accept several common env var names for the blob token to be robust
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || '';

      if (!blobToken) {
        console.error('Vercel Blob token missing; skipping upload. Set BLOB_READ_WRITE_TOKEN in project env.');
      } else {
        console.log('Attempting blob upload:', { 
          blobName, 
          bufferSize: buffer.length,
          tokenLength: blobToken.length,
          tokenPrefix: blobToken.substring(0, 20) + '...'
        });
        try {
          const blob = await put(blobName, buffer, {
            access: 'public',
            contentType: 'application/pdf',
            token: blobToken,
          });
          cvUrl = blob.url;
          console.log('Blob upload successful:', cvUrl);
        } catch (uploadErr) {
          console.error('Vercel Blob upload failed:', {
            error: uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
            errorStack: uploadErr instanceof Error ? uploadErr.stack : undefined,
          });
          // don't throw — allow email to be sent without CV link so the user flow continues
        }
      }
    }

    // Send email with Resend — include all submitted text fields
    const emailHtml = `
      <h3>Application: ${role_title}</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${location ? `<p><strong>Location/Timezone:</strong> ${location}</p>` : ''}
      ${links ? `<p><strong>Links:</strong> ${links}</p>` : ''}
      ${lane ? `<p><strong>Lane:</strong> ${lane}</p>` : ''}
      ${vendr_lane ? `<p><strong>Vendr lane:</strong> ${vendr_lane}</p>` : ''}
      ${vendr_examples ? `<p><strong>Vendr examples:</strong><br/>${vendr_examples.replace(/\n/g, '<br/>')}</p>` : ''}
      <h4>Why this role + why this structure?</h4>
      <p>${pitch || '<em>—</em>'}</p>
      ${cvUrl ? `<p><strong>CV:</strong> <a href="${cvUrl}">${cvFilename}</a></p>` : '<p><em>No CV uploaded</em></p>'}
    `;

    const plainText = [
      `Application: ${role_title}`,
      `Name: ${name}`,
      `Email: ${email}`,
      location ? `Location/Timezone: ${location}` : null,
      links ? `Links: ${links}` : null,
      lane ? `Lane: ${lane}` : null,
      vendr_lane ? `Vendr lane: ${vendr_lane}` : null,
      vendr_examples ? `Vendr examples:\n${vendr_examples}` : null,
      '',
      'Why this role + why this structure?',
      pitch || '-',
      cvUrl ? `CV: ${cvUrl}` : 'No CV uploaded',
    ]
      .filter(Boolean)
      .join('\n');

    // If upload failed but user provided CV data, attach the CV directly to the email as a fallback.
    const attachments = (!cvUrl && cvBase64 && cvFilename)
      ? [
          {
            filename: cvFilename,
            content: cvBase64,
          },
        ]
      : undefined;

    const emailPayload: any = {
      from: 'noreply@vnta.xyz',
      to: 'studio@vnta.xyz',
      subject: subject || `New Enquiry: ${role_title}`,
      html: emailHtml,
      text: plainText,
    };

    if (attachments) emailPayload.attachments = attachments;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SEND_EMAIL}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend error (status:', response.status, '):', errorText);
      throw new Error(`Resend API failed: ${response.status} - ${errorText}`);
    }

    res.status(200).json({ success: true, cvUrl, uploadError: undefined });
  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : String(error));
    // If the error originated from the upload step we may have a message to help debugging.
    res.status(500).json({ error: 'Failed to submit application', details: error instanceof Error ? error.message : String(error) });
  }
}
